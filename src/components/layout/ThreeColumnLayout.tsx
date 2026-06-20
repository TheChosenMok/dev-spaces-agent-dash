import type { ReactNode } from 'react'

interface ThreeColumnLayoutProps {
  sidebar: ReactNode
  center: ReactNode
  right: ReactNode
}

export function ThreeColumnLayout({ sidebar, center, right }: ThreeColumnLayoutProps) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--canvas)' }}>
      {sidebar}
      <div style={{ flex: 1, display: 'flex', minWidth: 0, overflow: 'hidden', gap: 1, padding: '8px 8px 8px 0' }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xs)',
            overflow: 'hidden',
          }}
        >
          {center}
        </div>
        <div style={{ width: 8, flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xs)',
            overflow: 'hidden',
          }}
        >
          {right}
        </div>
      </div>
    </div>
  )
}
