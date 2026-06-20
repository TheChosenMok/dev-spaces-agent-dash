import { ChevronDown } from 'lucide-react'
import { useRef, useState } from 'react'
import type { IdeOption } from '../../types'
import { IDE_LABELS } from '../../types'
import { useClickOutside } from '../../hooks/useClickOutside'
import { IdeIcon } from './IdeIcons'

interface IdeSelectorProps {
  value: IdeOption
  onChange: (ide: IdeOption) => void
  onOpen: (ide: IdeOption) => void
}

const OPTIONS: IdeOption[] = ['vscode', 'intellij', 'eclipse-che', 'cursor']

export function IdeSelector({ value, onChange, onOpen }: IdeSelectorProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  useClickOutside(wrapRef, () => setOpen(false))

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'flex' }}>
      {/* Primary action — open in selected IDE */}
      <button
        type="button"
        onClick={() => onOpen(value)}
        title={`Open in ${IDE_LABELS[value]}`}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
          border: '1px solid var(--border)', borderRight: 'none',
          background: 'var(--surface)', color: 'var(--text-primary)',
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
          transition: 'background 80ms ease, border-color 80ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <IdeIcon ide={value} size={18} />
        {IDE_LABELS[value]}
      </button>

      {/* Dropdown toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Choose IDE"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 24, padding: 0,
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          border: '1px solid var(--border)',
          background: 'var(--surface)', color: 'var(--text-tertiary)',
          cursor: 'pointer',
          transition: 'background 80ms ease, border-color 80ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <ChevronDown size={11} />
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', right: 0,
            minWidth: 170, padding: 4, borderRadius: 'var(--radius)',
            background: 'var(--surface)', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)', zIndex: 10, listStyle: 'none',
            animation: 'fadeIn 100ms ease',
          }}
        >
          {OPTIONS.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: value === opt ? 'var(--surface-hover)' : 'transparent',
                  color: value === opt ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: 12, textAlign: 'left', cursor: 'pointer',
                  fontWeight: value === opt ? 500 : 400,
                  transition: 'background 60ms ease',
                }}
                onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = 'var(--surface-hover)' }}
                onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = 'transparent' }}
              >
                <IdeIcon ide={opt} size={18} />
                {IDE_LABELS[opt]}
                {value === opt && (
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-tertiary)' }}>Default</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
