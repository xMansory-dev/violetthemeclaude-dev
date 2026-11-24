import { expect, test } from 'claude-code/testing'

test('the backdrop scene is accepted on desktop and mobile', async ($, on) => {
  for (const surface of ['desktop', 'mobile'] as const) {
    const ui = await $.ui.mount({
      plugin: 'violet-dev',
      component: 'Backdrop',
      props: { scene: 'code-mood' },
      surface,
    } as never)
    const svg = await ui.find({ type: 'Svg' })
    expect(svg).toBeTruthy()
    await ui.unmount()
  }
})
