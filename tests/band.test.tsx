import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'violet-dev',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 100,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
  },
} as const

test('the limits line draws on every surface', async ($, on) => {
  on('clock.now', () => ({ value: 0 }))
  on('command.register', () => ({ value: { command: 'limits' } }))
  on('theme.set', () => ({ value: { isDrawn: true, requestId: 'test' } }))
  on('session.usage', () => ({
    value: {
      startedAt: 0,
      context: { window: 200000, tokens: 80000, percent: 40 },
      rateLimits: [
        { kind: 'five_hour', percentUsed: 34 },
        { kind: 'seven_day', percentUsed: 72 },
      ],
    },
  }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect((await ui.find({ type: 'Text', text: /5ч/ }))?.text).toContain('34%')
    expect((await ui.find({ type: 'Text', text: /Неделя/ }))?.text).toContain('72%')
    expect((await ui.find({ type: 'Text', text: /Контекст/ }))?.text).toContain('40%')
    await ui.unmount()
  }
})

test('before any figures it says so', async ($, on) => {
  on('clock.now', () => ({ value: 0 }))
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /появятся/ }))?.text).toContain('Лимиты')
  await ui.unmount()
})
