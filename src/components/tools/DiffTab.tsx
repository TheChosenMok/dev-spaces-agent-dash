import { FilePlus, FileEdit, FileX } from 'lucide-react'
import type { Task, FileChange } from '../../types'
import { useState } from 'react'

interface DiffTabProps {
  task: Task
}

const STATUS_ICON = { added: FilePlus, modified: FileEdit, deleted: FileX } as const
const STATUS_COLOR = { added: 'var(--green)', modified: 'var(--orange)', deleted: 'var(--red)' } as const

function DiffLine({ line }: { line: string }) {
  let bg = 'transparent'
  let color = 'var(--text-primary)'
  if (line.startsWith('+') && !line.startsWith('+++')) { bg = 'var(--green-bg)'; color = 'var(--green)' }
  else if (line.startsWith('-') && !line.startsWith('---')) { bg = 'var(--red-bg)'; color = 'var(--red)' }
  else if (line.startsWith('@@')) { color = 'var(--purple)' }
  else if (line.startsWith('+++') || line.startsWith('---')) { color = 'var(--text-secondary)'; }

  return (
    <div style={{ padding: '0 16px', background: bg, color, minHeight: 20, lineHeight: '20px' }}>
      {line || '\u00a0'}
    </div>
  )
}

function FileCard({ change, expanded, onToggle }: { change: FileChange; expanded: boolean; onToggle: () => void }) {
  const Icon = STATUS_ICON[change.status]
  const lines = change.hunks.split('\n')

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 8 }}>
      {/* File header */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          padding: '8px 14px', background: 'var(--surface-inset)',
          borderBottom: expanded ? '1px solid var(--border)' : 'none',
          cursor: 'pointer', fontSize: 12, color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)', textAlign: 'left',
        }}
      >
        <Icon size={14} color={STATUS_COLOR[change.status]} strokeWidth={1.75} />
        <span style={{ flex: 1 }}>{change.path}</span>
        <span style={{ color: 'var(--green)', fontSize: 11 }}>+{change.additions}</span>
        {change.deletions > 0 && <span style={{ color: 'var(--red)', fontSize: 11 }}>-{change.deletions}</span>}
      </button>
      {/* Diff content */}
      {expanded && (
        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: '20px', overflow: 'auto' }}>
          {lines.map((line, i) => <DiffLine key={i} line={line} />)}
        </pre>
      )}
    </div>
  )
}

export function DiffTab({ task }: DiffTabProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    task.changes.forEach((c) => { init[c.path] = true })
    return init
  })

  if (task.changes.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
        No file changes yet
      </div>
    )
  }

  const totalAdd = task.changes.reduce((s, c) => s + c.additions, 0)
  const totalDel = task.changes.reduce((s, c) => s + c.deletions, 0)

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 16 }}>
      {/* Summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
        <span>{task.changes.length} file{task.changes.length !== 1 ? 's' : ''} changed</span>
        <span style={{ color: 'var(--green)' }}>+{totalAdd}</span>
        {totalDel > 0 && <span style={{ color: 'var(--red)' }}>-{totalDel}</span>}
      </div>

      {task.changes.map((change) => (
        <FileCard
          key={change.path}
          change={change}
          expanded={expanded[change.path] ?? true}
          onToggle={() => setExpanded((prev) => ({ ...prev, [change.path]: !prev[change.path] }))}
        />
      ))}
    </div>
  )
}
