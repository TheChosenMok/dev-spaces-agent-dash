import { Settings, Sparkles, Plug } from 'lucide-react'

interface SidebarFooterProps {
  onSkills: () => void
  onMcps: () => void
  onSettings: () => void
}

export function SidebarFooter({ onSkills, onMcps, onSettings }: SidebarFooterProps) {
  const btn: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '7px 16px',
    fontSize: 13,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'color 80ms ease, background 80ms ease',
    borderRadius: 'var(--radius-sm)',
  }
  const enter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'var(--border-subtle)'
    e.currentTarget.style.color = 'var(--text-primary)'
  }
  const leave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.color = 'var(--text-secondary)'
  }

  return (
    <div style={{ padding: '8px 8px 12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <button type="button" style={btn} onClick={onSkills} onMouseEnter={enter} onMouseLeave={leave}>
        <Sparkles size={15} strokeWidth={1.75} aria-hidden /> Skills
      </button>
      <button type="button" style={btn} onClick={onMcps} onMouseEnter={enter} onMouseLeave={leave}>
        <Plug size={15} strokeWidth={1.75} aria-hidden /> MCPs
      </button>
      <button type="button" style={btn} onClick={onSettings} onMouseEnter={enter} onMouseLeave={leave}>
        <Settings size={15} strokeWidth={1.75} aria-hidden /> Settings
      </button>
    </div>
  )
}
