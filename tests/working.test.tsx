import { expect, test } from 'claude-code/testing'

const BACKDROP = {
  plugin: 'violet-dev',
  component: 'Backdrop',
  props: { scene: 'code-mood' },
  surface: 'desktop',
} as never

test('while a turn runs the backdrop shows the coding window', async ($, on) => {
  on('state.get', () => ({ value: { value: true, version: 1 } }))

  const ui = await $.ui.mount(BACKDROP)
  const svg = await ui.find({ type: 'Svg' })

  expect(String(svg?.props.source)).toContain('coding window')
  expect(String(svg?.props.alt)).toContain('печатается код')
  await ui.unmount()
})

test('when idle the backdrop is the calm scene', async ($, on) => {
  on('state.get', () => ({ value: { value: false, version: 1 } }))

  const ui = await $.ui.mount(BACKDROP)
  const svg = await ui.find({ type: 'Svg' })

  expect(String(svg?.props.source)).not.toContain('coding window')
  await ui.unmount()
})
