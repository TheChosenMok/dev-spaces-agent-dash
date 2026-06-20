import type { TaskStatus } from '../../types'

interface TaskItemProps {
  name: string
  status: TaskStatus
  selected: boolean
  onClick: () => void
}

const DOT_COLOR: Record<TaskStatus, string> = {
  queued: 'var(--text-tertiary)',
  running: 'var(--accent)',
  completed: 'var(--green)',
  failed: 'var(--red)',
}

export function TaskItem({ name, status, selected, onClick }: TaskItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        background: selected ? 'var(--surface-hover)' : 'transparent',
        color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: selected ? 500 : 400,
        lineHeight: '20px',
        transition: 'background 100ms ease, color 100ms ease',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.background = 'var(--border-subtle)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: DOT_COLOR[status],
          flexShrink: 0,
          boxShadow: status === 'running' ? '0 0 0 2px rgba(9,105,218,0.2)' : 'none',
          animation: status === 'running' ? 'pulse 2s ease-in-out infinite' : 'none',
        }}
      />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        {name}
      </span>
      {status === 'failed' && (
        <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 500 }}>FAILED</span>
      )}
    </button>
  )
}
