import { FileCode, GitBranch, Code, Terminal } from 'lucide-react'
import type { Task, ToolTab } from '../../types'
import { DiffTab } from './DiffTab'
import { EditorTab } from './EditorTab'
import { GitTab } from './GitTab'
import { UserTerminalTab } from './UserTerminalTab'

interface DeveloperToolsPanelProps {
  task: Task | null
  activeTab: ToolTab
  onTabChange: (tab: ToolTab) => void
}

const TABS: { id: ToolTab; label: string; icon: typeof FileCode }[] = [
  { id: 'changes', label: 'Changes', icon: FileCode },
  { id: 'git', label: 'Git', icon: GitBranch },
  { id: 'editor', label: 'Editor', icon: Code },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
]

export function DeveloperToolsPanel({ task, activeTab, onTabChange }: DeveloperToolsPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Tab bar */}
      <div
        style={{
          flexShrink: 0,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'stretch',
          padding: '0 10px',
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'color 80ms ease',
                borderBottom: active ? '2px solid var(--text-primary)' : '2px solid transparent',
                marginBottom: -1,
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-secondary)' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
            >
              <Icon size={14} strokeWidth={1.75} />
              {tab.label}
              {tab.id === 'changes' && task && task.changes.length > 0 && (
                <span style={{ fontSize: 10, fontWeight: 600, background: 'var(--surface-hover)', color: 'var(--text-secondary)', padding: '0 5px', borderRadius: 10, lineHeight: '16px' }}>
                  {task.changes.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div role="tabpanel" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {!task ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            Select a task to view details
          </div>
        ) : (
          <>
            {activeTab === 'changes' && <DiffTab task={task} />}
            {activeTab === 'git' && <GitTab task={task} />}
            {activeTab === 'editor' && <EditorTab task={task} />}
            {activeTab === 'terminal' && <UserTerminalTab task={task} />}
          </>
        )}
      </div>
    </div>
  )
}
