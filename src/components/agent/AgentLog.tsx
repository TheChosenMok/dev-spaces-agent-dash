import { FileText, Terminal, Brain, CheckCircle2, XCircle, ChevronRight, MessageSquare } from 'lucide-react'
import type { Task, AgentStep } from '../../types'

interface AgentLogProps {
  task: Task
  cli: string
}

const STEP_CONFIG: Record<AgentStep['type'], { icon: typeof FileText; color: string; bg: string }> = {
  thinking: { icon: Brain, color: 'var(--purple)', bg: 'var(--purple-bg)' },
  tool: { icon: FileText, color: 'var(--accent)', bg: 'var(--accent-bg)' },
  command: { icon: Terminal, color: 'var(--text-secondary)', bg: 'var(--surface-hover)' },
  output: { icon: MessageSquare, color: 'var(--text-secondary)', bg: 'var(--surface-hover)' },
  success: { icon: CheckCircle2, color: 'var(--green)', bg: 'var(--green-bg)' },
  error: { icon: XCircle, color: 'var(--red)', bg: 'var(--red-bg)' },
}

export function AgentLog({ task, cli }: AgentLogProps) {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px' }}>
      {/* Task header card */}
      <div
        style={{
          padding: '14px 16px',
          borderRadius: 'var(--radius)',
          background: 'var(--surface-inset)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          {task.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {task.description}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            via {cli}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {task.steps.length} steps
          </span>
          {task.status === 'running' && (
            <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}>
              In progress
            </span>
          )}
          {task.status === 'completed' && (
            <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>
              Completed
            </span>
          )}
          {task.status === 'failed' && (
            <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 500 }}>
              Failed
            </span>
          )}
        </div>
      </div>

      {/* Steps */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 13,
            top: 4,
            bottom: 4,
            width: 1,
            background: 'var(--border)',
          }}
        />

        {task.steps.map((step, i) => {
          const config = STEP_CONFIG[step.type]
          const Icon = config.icon
          const isLast = i === task.steps.length - 1

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                padding: '6px 0',
                position: 'relative',
                animation: 'fadeIn 200ms ease',
                animationDelay: `${i * 30}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: config.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 1,
                  border: '2px solid var(--surface)',
                }}
              >
                <Icon size={12} color={config.color} strokeWidth={2} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0, paddingTop: 3 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 13, color: step.type === 'error' ? 'var(--red)' : step.type === 'success' ? 'var(--green)' : 'var(--text-primary)', fontWeight: step.type === 'error' || step.type === 'success' ? 500 : 400 }}>
                    {step.label}
                  </span>
                  {step.timestamp && (
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                      {step.timestamp}
                    </span>
                  )}
                </div>
                {step.detail && (
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ChevronRight size={10} style={{ opacity: 0.4, flexShrink: 0 }} />
                    {step.detail}
                  </div>
                )}
              </div>

              {/* Pulsing dot for last running step */}
              {isLast && task.status === 'running' && (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.5s ease-in-out infinite', alignSelf: 'center', flexShrink: 0 }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
