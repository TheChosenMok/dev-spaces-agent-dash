export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed'

export type CliProvider = 'opencode' | 'claude-code' | 'copilot-cli'

export type IdeOption = 'vscode' | 'intellij' | 'eclipse-che' | 'cursor'

export type ToolTab = 'changes' | 'git' | 'editor' | 'terminal'

export interface AgentStep {
  type: 'command' | 'tool' | 'output' | 'thinking' | 'error' | 'success'
  label: string
  detail?: string
  timestamp?: string
}

export interface TerminalLine {
  text: string
  delay?: number
  color?: string
}

export interface FileChange {
  path: string
  status: 'added' | 'modified' | 'deleted'
  additions: number
  deletions: number
  hunks: string
}

export interface Task {
  id: string
  name: string
  description: string
  status: TaskStatus
  steps: AgentStep[]
  agentScript: TerminalLine[]
  changes: FileChange[]
  git: { branch: string; ahead: number; behind: number; log: { hash: string; message: string; time: string }[] }
  editor: { filename: string; language: string; content: string }
}

export interface Project {
  id: string
  name: string
  repo: string
  expanded: boolean
  tasks: Task[]
}

export const CLI_LABELS: Record<CliProvider, string> = {
  opencode: 'OpenCode',
  'claude-code': 'Claude Code',
  'copilot-cli': 'Copilot CLI',
}

export const IDE_LABELS: Record<IdeOption, string> = {
  vscode: 'VS Code',
  intellij: 'IntelliJ IDEA',
  'eclipse-che': 'Eclipse Che',
  cursor: 'Cursor',
}
