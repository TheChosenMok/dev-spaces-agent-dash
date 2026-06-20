import type { Task } from '../../types'
import { MockTerminal } from '../agent/MockTerminal'

interface UserTerminalTabProps {
  task: Task
}

export function UserTerminalTab({ task }: UserTerminalTabProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <MockTerminal mode="user" scriptKey={task.id} interactive />
    </div>
  )
}
