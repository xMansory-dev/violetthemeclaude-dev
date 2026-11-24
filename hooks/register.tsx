import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs, SessionRateLimit } from 'claude-code'

import type { Limit, Usage } from '../types'
import { makeColors } from './make-colors.js'
import { SCENE, SCENE_WORKING } from './scene'

// ---------- colors ----------

const { theme, problems } = makeColors({
  label: 'Deep Teal',
  only: 'dark',
  roles: { accent: '#3fa7b0', danger: '#e5484d', success: '#5fd39f', warning: '#d97706', pro: '#5bc0de' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0f14',
        'surface-1': '#13202a',
        'surface-2': '#182833',
        'surface-3': '#1a2b36',
        'text-primary': '#f1ece3',
        'text-secondary': '#c6d2d4',
        'text-muted': '#97adb2',
      },
    },
  },
})

const BASE: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'code-mood', glass: { blur: 40, tint: '#0b141b', opacity: 0.32 } },
}

const LOOK: ThemeSetArgs = {
  ...BASE,
  style: {
    Text: { fontFamily: ['sans'], fontSize: 15, lineHeight: 24, letterSpacing: 0 },
    Heading: { fontWeight: 'semibold', color: '#eadcc8', letterSpacing: 0 },
    UserMessage: {
      color: '#f4efe6',
      backgroundColor: '#1f5a5ecc',
      fill: { gradient: { angle: 135, stops: ['#2e6f73cc', '#0f3d3ecc'] } },
      radius: [20, 20, 6, 20],
      paddingX: 16,
      paddingY: 11,
      borderColor: '#7fb3b840',
      borderWidth: 1,
      shadow: { x: 0, y: 8, blur: 28, color: '#00000055' },
    },
    AssistantMessage: {
      color: '#ece8df',
      backgroundColor: '#0f1a22b8',
      radius: 20,
      paddingX: 18,
      paddingY: 14,
      borderColor: '#ffffff12',
      borderWidth: 1,
      shadow: { x: 0, y: 8, blur: 30, color: '#00000055' },
    },
    ToolUse: {
      color: '#a9d6da',
      fontFamily: ['code'],
      backgroundColor: '#0f1c24b8',
      radius: 12,
      paddingX: 12,
      borderColor: '#7fb3b822',
      borderWidth: 1,
    },
  },
}

// ---------- usage state ----------

const usage = atom({ plugin: 'violet-dev', key: 'usage' } as const, { limits: [] } as Usage)
const isHidden = atom({ plugin: 'violet-dev', key: 'hideLimits' } as const, false)
const isWorking = atom({ plugin: 'violet-dev', key: 'working' } as const, false)

const toUsage = (limits: SessionRateLimit[], contextPercent?: number): Usage => ({
  limits: limits.map(l => ({ kind: l.kind, percentUsed: l.percentUsed, resetsAt: l.resetsAt })),
  contextPercent,
})

const LABELS: Record<string, string> = {
  five_hour: '5ч',
  seven_day: 'Неделя',
  spend_limit: 'Расход',
}

const barColor = (p: number): string => (p >= 85 ? '#ff5c61' : p >= 60 ? '#ffa53d' : '#6ee7ef')

const untilReset = (iso: string | undefined, now: number): string => {
  if (iso === undefined) {
    return ''
  }
  const ms = Date.parse(iso) - now

  if (!Number.isFinite(ms) || ms <= 0) {
    return ''
  }
  const min = Math.round(ms / 60000)
  const d = Math.floor(min / 1440)
  const h = Math.floor((min % 1440) / 60)
  const m = min % 60

  return d > 0 ? `${d}д ${h}ч` : h > 0 ? `${h}ч ${m}м` : `${m}м`
}

const BAR = 7

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.log(unpainted)
    }

    try {
      await $.theme.set(LOOK)
    } catch (error) {
      $.ui.log(String(error))
      await $.theme.set(BASE)
    }

    await $.command.register({ name: 'limits', description: 'Показать или скрыть строку лимитов' })
    await update($, isWorking, () => false)

    try {
      const u = await $.session.usage()
      await update($, usage, () => toUsage(u.rateLimits, u.context.percent))
    } catch {
      // no figures yet
    }

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    await update($, usage, () => toUsage(e.rateLimits, e.context.percent))

    return next(e)
  })

  // The main loop's turn: while it runs, the backdrop shows a window where code
  // is being typed. Subagents' turns leave it alone.
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      await update($, isWorking, () => true)
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) {
      await update($, isWorking, () => false)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    const working = await read($, isWorking)

    return working ? (
      <Svg source={SCENE_WORKING} alt="Окно редактора в углу, где строка за строкой печатается код: Claude выполняет задачу" />
    ) : (
      <Svg source={SCENE} alt="Спокойный бирюзово-синий градиент с едва заметными фрагментами кода по краям" />
    )
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) {
      return next(e)
    }
    const u = await read($, usage)
    const now = await $.clock.now()
    const { Box, Text } = $.ui.resolve(e)

    // Each meter is one Text: label, bar, percent, time to reset. The meters
    // share the row evenly, so all of them fit and line up.
    const items: JSX.Element[] = []
    const add = (label: string, pct: number, reset: string) => {
      const filled = Math.max(0, Math.min(BAR, Math.round((pct / 100) * BAR)))

      items.push(
        <Text size="footnote" wrap="truncate-end">
          <Text color="#b8cbcf" weight="medium">{`${label}  `}</Text>
          <Text color={barColor(pct)} weight="bold">{'▰'.repeat(filled)}</Text>
          <Text color="#2f4652" weight="bold">{'▰'.repeat(BAR - filled)}</Text>
          <Text color="#f1ece3" weight="semibold" tabular>{`  ${Math.round(pct)}%`}</Text>
          {reset !== '' ? <Text color="#7f99a2">{`  ↻ ${reset}`}</Text> : ''}
        </Text>,
      )
    }

    for (const l of u.limits as Limit[]) {
      add(LABELS[l.kind] ?? l.kind, l.percentUsed, untilReset(l.resetsAt, now))
    }

    if (u.contextPercent !== undefined) {
      add('Контекст', u.contextPercent, '')
    }

    if (items.length === 0) {
      return (
        <Text size="footnote" color="#7f99a2">
          Лимиты появятся после первого ответа
        </Text>
      )
    }

    return (
      <Box flexDirection="row" justifyContent="space-between" gap={2}>
        {items}
      </Box>
    )
  })

  on('command.run', { command: 'limits' }, async ($, e) => {
    const hidden = await update($, isHidden, v => !v)

    return { text: hidden ? 'Строка лимитов скрыта' : 'Строка лимитов показана' }
  })
}
