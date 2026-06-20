import { useCallback, useState } from 'react'
import { AgenticCliPanel } from './components/agent/AgenticCliPanel'
import { ThreeColumnLayout } from './components/layout/ThreeColumnLayout'
import { ProjectSidebar } from './components/sidebar/ProjectSidebar'
import { DeveloperToolsPanel } from './components/tools/DeveloperToolsPanel'
import { DEFAULT_TASK_ID, mockProjects } from './data/mockProjects'
import { findActiveTask } from './hooks/useActiveTask'
import type { CliProvider, IdeOption, Project, ToolTab } from './types'

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => structuredClone(mockProjects))
  const [activeTaskId, setActiveTaskId] = useState<string | null>(DEFAULT_TASK_ID)
  const [activeToolTab, setActiveToolTab] = useState<ToolTab>('changes')
  const [selectedCli] = useState<CliProvider>('opencode')
  const [selectedIde, setSelectedIde] = useState<IdeOption>('vscode')
  const [toast, setToast] = useState<string | null>(null)

  const { activeTask } = findActiveTask(projects, activeTaskId)

  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }, [])

  return (
    <>
      <ThreeColumnLayout
        sidebar={
          <ProjectSidebar
            projects={projects}
            activeTaskId={activeTaskId}
            onProjectsChange={setProjects}
            onSelectTask={setActiveTaskId}
            onToast={showToast}
          />
        }
        center={
          <AgenticCliPanel
            task={activeTask}
            selectedCli={selectedCli}
            selectedIde={selectedIde}
            onIdeChange={setSelectedIde}
            onToast={showToast}
          />
        }
        right={
          <DeveloperToolsPanel
            task={activeTask}
            activeTab={activeToolTab}
            onTabChange={setActiveToolTab}
          />
        }
      />

      {toast && (
        <div
          role="status"
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            padding: '10px 20px', borderRadius: 'var(--radius)',
            background: 'var(--text-primary)', color: 'var(--text-inverse)',
            fontSize: 13, fontWeight: 500,
            boxShadow: 'var(--shadow-lg)', zIndex: 200,
            animation: 'fadeIn 150ms ease',
          }}
        >
          {toast}
        </div>
      )}
    </>
  )
}
