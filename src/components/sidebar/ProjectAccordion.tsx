import { ChevronRight, Plus } from 'lucide-react'
import type { Project } from '../../types'
import { TaskItem } from './TaskItem'

interface ProjectAccordionProps {
  project: Project
  activeTaskId: string | null
  onToggle: (projectId: string) => void
  onSelectTask: (taskId: string) => void
  onNewTask: () => void
}

export function ProjectAccordion({
  project,
  activeTaskId,
  onToggle,
  onSelectTask,
  onNewTask,
}: ProjectAccordionProps) {
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        type="button"
        onClick={() => onToggle(project.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'transparent',
          color: 'var(--text-primary)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 80ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-subtle)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronRight
            size={14}
            strokeWidth={2}
            style={{
              transition: 'transform 150ms ease',
              transform: project.expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              color: 'var(--text-tertiary)',
              flexShrink: 0,
            }}
            aria-hidden
          />
          {project.name}
        </span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNewTask() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            transition: 'color 80ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
          title="New task"
        >
          <Plus size={14} strokeWidth={2} />
        </button>
      </button>

      {project.expanded && (
        <div style={{ marginTop: 2, paddingLeft: 4 }}>
          {project.tasks.map((task) => (
            <TaskItem
              key={task.id}
              name={task.name}
              status={task.status}
              selected={activeTaskId === task.id}
              onClick={() => onSelectTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
