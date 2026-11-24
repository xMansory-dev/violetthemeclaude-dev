export type Limit = { kind: string; percentUsed: number; resetsAt?: string }

export type Usage = { limits: Limit[]; contextPercent?: number }

declare module 'claude-code' {
  interface PluginState {
    'violet-dev': { usage: Usage; hideLimits: boolean; working: boolean }
  }
}
