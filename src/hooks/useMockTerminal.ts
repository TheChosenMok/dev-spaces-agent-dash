import { useCallback, useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { TERMINAL, XTERM_THEME } from '../components/agent/terminalTheme'
import type { TerminalLine } from '../types'

export type TerminalMode = 'agent' | 'user'

const MOCK_RESPONSES: { pattern: RegExp; response: string }[] = [
  { pattern: /^help$/i, response: 'Commands: git, npm, kubectl, ls, pwd, clear' },
  { pattern: /^git\s+status$/i, response: 'On branch feat/current\nChanges not staged for commit:\n  modified: src/App.tsx' },
  { pattern: /^git\s+log/i, response: 'a3f2c1d feat: latest commit\n9b8e7d6 chore: dependencies' },
  { pattern: /^npm\s+(run\s+)?(test|start)/i, response: '> test\n PASS  3 tests\n\nTest Suites: 1 passed, 1 total' },
  { pattern: /^kubectl\s+/i, response: 'NAME          READY   STATUS    RESTARTS   AGE\ndevspace-0    1/1     Running   0          2h' },
  { pattern: /^ls$/i, response: 'src/  package.json  README.md  node_modules/' },
  { pattern: /^pwd$/i, response: '/projects/workspace' },
  { pattern: /^clear$/i, response: '__CLEAR__' },
]

interface UseMockTerminalOptions {
  mode: TerminalMode
  containerRef: React.RefObject<HTMLDivElement | null>
  interactive?: boolean
}

export function useMockTerminal({ mode, containerRef, interactive = false }: UseMockTerminalOptions) {
  const terminalRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const inputBufferRef = useRef('')
  const prompt = '\x1b[32m$\x1b[0m '

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const term = new Terminal({
      theme: XTERM_THEME,
      fontFamily: 'var(--font-mono), JetBrains Mono, Fira Code, Consolas, monospace',
      fontSize: 12,
      lineHeight: 1.55,
      cursorBlink: true,
      cursorStyle: 'bar',
      disableStdin: mode === 'agent',
      convertEol: true,
      scrollback: 1000,
      allowTransparency: false,
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(container)

    terminalRef.current = term
    fitAddonRef.current = fitAddon

    const doFit = () => {
      try { fitAddon.fit() } catch { /* hidden */ }
    }

    doFit()
    const observer = new ResizeObserver(doFit)
    observer.observe(container)

    if (mode === 'user') {
      term.writeln(`\x1b[2m~/projects/workspace\x1b[0m`)
      term.write(prompt)

      term.onData((data) => {
        if (!interactive) return

        if (data.charCodeAt(0) === 127 || data === '\x7f') {
          if (inputBufferRef.current.length > 0) {
            inputBufferRef.current = inputBufferRef.current.slice(0, -1)
            term.write('\b \b')
          }
          return
        }

        if (data === '\r') {
          const line = inputBufferRef.current.trim()
          term.write('\r\n')
          if (line) {
            const match = MOCK_RESPONSES.find((r) => r.pattern.test(line))
            if (match?.response === '__CLEAR__') {
              term.clear()
            } else if (match) {
              term.writeln(match.response)
            } else {
              term.writeln(`bash: ${line}: command not found`)
            }
          }
          term.write(prompt)
          inputBufferRef.current = ''
          return
        }

        if (data >= ' ') {
          inputBufferRef.current += data
          term.write(data)
        }
      })
    }

    return () => {
      observer.disconnect()
      term.dispose()
      terminalRef.current = null
      fitAddonRef.current = null
    }
  }, [containerRef, mode, interactive])

  const playScript = useCallback((lines: TerminalLine[]) => {
    const term = terminalRef.current
    if (!term || mode !== 'agent') return

    term.clear()

    for (const line of lines) {
      const color = line.color ?? TERMINAL.fg
      const rgb = hexToRgb(color)
      const prefix = rgb ? `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m` : ''
      term.write(prefix + line.text + '\x1b[0m')
    }

    term.writeln('')
    term.write(`\x1b[38;2;106;153;85m❯\x1b[0m `)
  }, [mode])

  const resetUserTerminal = useCallback(() => {
    const term = terminalRef.current
    if (!term || mode !== 'user') return
    term.clear()
    inputBufferRef.current = ''
    term.writeln(`\x1b[2m~/projects/workspace\x1b[0m`)
    term.write(prompt)
  }, [mode])

  const fit = useCallback(() => {
    try { fitAddonRef.current?.fit() } catch { /* ignore */ }
  }, [])

  return { playScript, resetUserTerminal, fit }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!match) return null
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) }
}
