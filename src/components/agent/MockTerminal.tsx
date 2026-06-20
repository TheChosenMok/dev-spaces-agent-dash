import { useEffect, useRef } from 'react'
import { useMockTerminal, type TerminalMode } from '../../hooks/useMockTerminal'
import type { TerminalLine } from '../../types'
import { TERMINAL_BG } from './terminalTheme'

interface MockTerminalProps {
  mode: TerminalMode
  script?: TerminalLine[]
  scriptKey?: string
  interactive?: boolean
}

export function MockTerminal({ mode, script, scriptKey, interactive = false }: MockTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { playScript, resetUserTerminal, fit } = useMockTerminal({
    mode,
    containerRef,
    interactive,
  })

  useEffect(() => {
    if (mode === 'agent' && script) {
      playScript(script)
    }
  }, [mode, script, scriptKey, playScript])

  useEffect(() => {
    if (mode === 'user') {
      resetUserTerminal()
    }
  }, [mode, scriptKey, resetUserTerminal])

  useEffect(() => {
    const timer = setTimeout(fit, 50)
    return () => clearTimeout(timer)
  }, [fit, scriptKey, mode])

  return (
    <div
      className="terminal-frame"
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: TERMINAL_BG,
        overflow: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        className="terminal-body"
        style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: TERMINAL_BG }}
      />
    </div>
  )
}
