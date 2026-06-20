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

const MODE_LABELS: Record<TerminalMode, { title: string; badge?: string }> = {
  agent: { title: 'Agent CLI', badge: 'sandboxed' },
  user: { title: 'Shell', badge: 'workspace' },
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

  const { title, badge } = MODE_LABELS[mode]

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
        className="terminal-chrome"
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          background: TERMINAL_BG,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          <span className="terminal-dot" style={{ background: '#ff5f57' }} />
          <span className="terminal-dot" style={{ background: '#febc2e' }} />
          <span className="terminal-dot" style={{ background: '#28c840' }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#808080' }}>{title}</span>
        {badge && (
          <span style={{
            fontSize: 10, fontWeight: 500, color: '#666',
            padding: '1px 6px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {badge}
          </span>
        )}
      </div>
      <div
        ref={containerRef}
        className="terminal-body"
        style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: TERMINAL_BG }}
      />
    </div>
  )
}
