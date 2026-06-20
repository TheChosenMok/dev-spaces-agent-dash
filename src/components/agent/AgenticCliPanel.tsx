import { useState, useCallback } from 'react'
import { Shield, Terminal, List, Send } from 'lucide-react'
import type { CliProvider, IdeOption, Task } from '../../types'
import { CLI_LABELS, IDE_LABELS } from '../../types'
import { IdeSelector } from './CliSelector'
import { MockTerminal } from './MockTerminal'
import { AgentLog } from './AgentLog'

interface AgenticCliPanelProps {
  task: Task | null
  selectedCli: CliProvider
  selectedIde: IdeOption
  onIdeChange: (ide: IdeOption) => void
  onToast: (msg: string) => void
}

type View = 'log' | 'terminal'

export function AgenticCliPanel({ task, selectedCli, selectedIde, onIdeChange, onToast }: AgenticCliPanelProps) {
  const [view, setView] = useState<View>('log')
  const [prompt, setPrompt] = useState('')

  const handleSend = useCallback(() => {
    const text = prompt.trim()
    if (!text) return
    onToast(`Sent to agent: "${text}"`)
    setPrompt('')
  }, [prompt, onToast])

  const handleOpenIde = useCallback((ide: IdeOption) => {
    onToast(`Opening workspace in ${IDE_LABELS[ide]}`)
  }, [onToast])

  const viewBtn = (v: View, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => setView(v)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 12,
        fontWeight: view === v ? 500 : 400,
        color: view === v ? 'var(--text-primary)' : 'var(--text-tertiary)',
        background: view === v ? 'var(--surface-hover)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 80ms ease',
      }}
    >
      {icon} {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: '14px 18px 10px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              Agent
            </span>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '1px 7px', borderRadius: 'var(--radius-sm)',
                background: 'var(--orange-bg)', color: 'var(--orange)',
                fontSize: 10, fontWeight: 600, letterSpacing: '0.03em',
              }}
            >
              <Shield size={9} aria-hidden /> SANDBOX
            </span>
          </div>
          {task && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {task.name}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {viewBtn('log', <List size={13} />, 'Steps')}
          {viewBtn('terminal', <Terminal size={13} />, 'Raw')}
          <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
          <IdeSelector value={selectedIde} onChange={onIdeChange} onOpen={handleOpenIde} />
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!task ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            Select a task to view agent activity
          </div>
        ) : view === 'log' ? (
          <AgentLog task={task} cli={CLI_LABELS[selectedCli]} />
        ) : (
          <MockTerminal mode="agent" script={task.agentScript} scriptKey={task.id} />
        )}
      </div>

      {/* Prompt input */}
      <div
        style={{
          flexShrink: 0,
          padding: '10px 14px',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 6px 6px 14px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            background: 'var(--surface-inset)',
            transition: 'border-color 120ms ease',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder={task ? 'Ask the agent to do something...' : 'Select a task first'}
            disabled={!task}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: 13,
              lineHeight: '24px',
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!task || !prompt.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-sm)',
              background: prompt.trim() ? 'var(--text-primary)' : 'var(--surface-hover)',
              color: prompt.trim() ? 'var(--text-inverse)' : 'var(--text-tertiary)',
              cursor: prompt.trim() ? 'pointer' : 'default',
              transition: 'background 80ms ease, color 80ms ease',
              flexShrink: 0,
            }}
          >
            <Send size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
