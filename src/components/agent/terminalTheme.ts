/** Shared terminal palette — single solid black; keep in sync with index.css */
export const TERMINAL_BG = '#1e1e1e'

export const TERMINAL = {
  bg: TERMINAL_BG,
  fg: '#cccccc',
  muted: '#808080',
  accent: '#569cd6',
  green: '#6a9955',
  yellow: '#dcdcaa',
  red: '#f44747',
  blue: '#569cd6',
  purple: '#c586c0',
  cyan: '#4ec9b0',
} as const

export const XTERM_THEME = {
  background: TERMINAL_BG,
  foreground: TERMINAL.fg,
  cursor: '#aeafad',
  cursorAccent: TERMINAL_BG,
  selectionBackground: '#264f78',
  selectionForeground: '#ffffff',
  black: TERMINAL_BG,
  red: TERMINAL.red,
  green: TERMINAL.green,
  yellow: TERMINAL.yellow,
  blue: TERMINAL.blue,
  magenta: TERMINAL.purple,
  cyan: TERMINAL.cyan,
  white: '#d4d4d4',
  brightBlack: TERMINAL.muted,
  brightRed: TERMINAL.red,
  brightGreen: TERMINAL.green,
  brightYellow: TERMINAL.yellow,
  brightBlue: TERMINAL.blue,
  brightMagenta: TERMINAL.purple,
  brightCyan: TERMINAL.cyan,
  brightWhite: '#ffffff',
}
