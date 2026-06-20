import { useState, useCallback } from 'react'
import { Plus, X } from 'lucide-react'
import type { Task } from '../../types'
import { MockTerminal } from '../agent/MockTerminal'

interface UserTerminalTabProps {
  task: Task
}

interface TermTab {
  id: string
  label: string
}

let nextId = 2

export function UserTerminalTab({ task }: UserTerminalTabProps) {
  const [tabs, setTabs] = useState<TermTab[]>([{ id: 'term-1', label: 'bash' }])
  const [activeId, setActiveId] = useState('term-1')

  const addTab = useCallback(() => {
    const id = `term-${nextId++}`
    setTabs((prev) => [...prev, { id, label: 'bash' }])
    setActiveId(id)
  }, [])

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id)
      if (next.length === 0) {
        const newId = `term-${nextId++}`
        setActiveId(newId)
        return [{ id: newId, label: 'bash' }]
      }
      if (id === activeId) setActiveId(next[next.length - 1].id)
      return next
    })
  }, [activeId])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Terminal tab bar */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          background: '#181818',
          borderBottom: '1px solid #2a2a2a',
          minHeight: 34,
        }}
      >
        {tabs.map((tab) => {
          const active = tab.id === activeId
          return (
            <div
              key={tab.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '0 4px 0 12px',
                height: 34,
                fontSize: 12,
                color: active ? '#d4d4d4' : '#808080',
                background: active ? '#1e1e1e' : 'transparent',
                borderRight: '1px solid #2a2a2a',
                cursor: 'pointer',
                transition: 'color 80ms ease',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#b0b0b0' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = active ? '#d4d4d4' : '#808080' }}
            >
              <span
                onClick={() => setActiveId(tab.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: active ? '#6a9955' : '#555', flexShrink: 0 }} />
                {tab.label}
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 20, height: 20, borderRadius: 3,
                  color: '#808080', transition: 'color 80ms ease, background 80ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#d4d4d4'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#808080'; e.currentTarget.style.background = 'transparent' }}
              >
                <X size={12} strokeWidth={2} />
              </button>
            </div>
          )
        })}
        <button
          type="button"
          onClick={addTab}
          aria-label="New terminal"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, margin: '0 4px',
            borderRadius: 4, color: '#808080',
            transition: 'color 80ms ease, background 80ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#d4d4d4'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#808080'; e.currentTarget.style.background = 'transparent' }}
        >
          <Plus size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Terminal body — render all, show active */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              position: 'absolute',
              inset: 0,
              display: tab.id === activeId ? 'flex' : 'none',
              flexDirection: 'column',
            }}
          >
            <MockTerminal mode="user" scriptKey={`${task.id}-${tab.id}`} interactive />
          </div>
        ))}
      </div>
    </div>
  )
}
