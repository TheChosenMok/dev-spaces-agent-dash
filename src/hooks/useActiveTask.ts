import type { Project, Task } from '../types'

export function findActiveTask(
  projects: Project[],
  activeTaskId: string | null,
): { activeTask: Task | null; activeProject: Project | null } {
  if (!activeTaskId) return { activeTask: null, activeProject: null }
  for (const project of projects) {
    const task = project.tasks.find((t) => t.id === activeTaskId)
    if (task) return { activeTask: task, activeProject: project }
  }
  return { activeTask: null, activeProject: null }
}
