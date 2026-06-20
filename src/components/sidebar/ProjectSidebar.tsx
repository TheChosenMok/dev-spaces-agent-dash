import { useState } from 'react'
import { FolderPlus, X } from 'lucide-react'
import type { Project } from '../../types'
import { ProjectAccordion } from './ProjectAccordion'
import { SidebarFooter } from './SidebarFooter'

interface ProjectSidebarProps {
  projects: Project[]
  activeTaskId: string | null
  onProjectsChange: (projects: Project[]) => void
  onSelectTask: (taskId: string) => void
  onToast: (message: string) => void
}

export function ProjectSidebar({ projects, activeTaskId, onProjectsChange, onSelectTask, onToast }: ProjectSidebarProps) {
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const handleToggle = (projectId: string) => {
    onProjectsChange(projects.map((p) => p.id === projectId ? { ...p, expanded: !p.expanded } : p))
  }

  const handleNewProject = () => {
    const name = newProjectName.trim()
    if (!name) return
    onProjectsChange([...projects, { id: `proj-${Date.now()}`, name, repo: `org/${name}`, expanded: true, tasks: [] }])
    setNewProjectName('')
    setShowNewProject(false)
    onToast(`Created workspace "${name}"`)
  }

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        height: '100%',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Dev Spaces
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
            Agentic Dashboard
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowNewProject(true)}
          title="New workspace"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'background 80ms ease, color 80ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <FolderPlus size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* Project list */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 8px' }}>
        {projects.map((project) => (
          <ProjectAccordion
            key={project.id}
            project={project}
            activeTaskId={activeTaskId}
            onToggle={handleToggle}
            onSelectTask={onSelectTask}
            onNewTask={() => onToast('Task creation — connect Dev Spaces API')}
          />
        ))}
      </div>

      <SidebarFooter
        onSkills={() => onToast('Skills registry')}
        onMcps={() => onToast('MCP server configuration')}
        onSettings={() => onToast('Workspace settings')}
      />

      {/* New project dialog */}
      {showNewProject && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}
          onClick={() => setShowNewProject(false)}
        >
          <div
            style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24, width: 380, boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 150ms ease' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>New workspace</h2>
              <button type="button" onClick={() => setShowNewProject(false)} style={{ color: 'var(--text-tertiary)', padding: 2, cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
            </div>
            <input
              type="text"
              placeholder="Workspace name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNewProject()}
              autoFocus
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-inset)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
            />
            <button
              type="button"
              onClick={handleNewProject}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--text-primary)', color: 'var(--text-inverse)', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 12 }}
            >
              Create workspace
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
