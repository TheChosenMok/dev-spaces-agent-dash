import { useState } from 'react'
import { GitBranch, GitCommit, Upload, Plus, Minus, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import type { Task, FileChange } from '../../types'

interface GitTabProps {
  task: Task
}

const STATUS_DOT: Record<FileChange['status'], { color: string; letter: string }> = {
  added: { color: 'var(--green)', letter: 'A' },
  modified: { color: 'var(--orange)', letter: 'M' },
  deleted: { color: 'var(--red)', letter: 'D' },
}

export function GitTab({ task }: GitTabProps) {
  const { branch, ahead, behind, log } = task.git
  const [commitMsg, setCommitMsg] = useState('')
  const [staged, setStaged] = useState<Set<string>>(() => new Set())
  const [toast, setToast] = useState<string | null>(null)

  const unstaged = task.changes.filter((c) => !staged.has(c.path))
  const stagedFiles = task.changes.filter((c) => staged.has(c.path))

  const stageAll = () => setStaged(new Set(task.changes.map((c) => c.path)))
  const unstageAll = () => setStaged(new Set())

  const toggleStage = (path: string) =>
    setStaged((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path); else next.add(path)
      return next
    })

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2400) }

  const handleCommit = () => {
    if (!stagedFiles.length || !commitMsg.trim()) return
    flash(`Committed ${stagedFiles.length} file${stagedFiles.length > 1 ? 's' : ''}`)
    setCommitMsg('')
    setStaged(new Set())
  }

  const canCommit = stagedFiles.length > 0 && commitMsg.trim().length > 0

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>

      {/* ── top bar: branch + actions ─────────────────────────── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 16px', borderBottom: '1px solid var(--border)',
      }}>
        <GitBranch size={14} color="var(--accent)" />
        <code style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
          {branch}
        </code>

        {ahead > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
            <ArrowUp size={10} />{ahead}
          </span>
        )}
        {behind > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, color: 'var(--orange)', fontWeight: 600 }}>
            <ArrowDown size={10} />{behind}
          </span>
        )}

        <div style={{ flex: 1 }} />

        <ActionBtn icon={<RefreshCw size={13} />} label="Sync" onClick={() => flash('Synced with remote')} />
        <ActionBtn icon={<Upload size={13} />} label="Push" onClick={() => flash(`Pushed ${branch} to origin`)} />
      </div>

      {/* ── scrollable body ───────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>

        {/* commit box — always visible */}
        <div style={{ padding: '14px 16px 10px' }}>
          <input
            type="text"
            value={commitMsg}
            onChange={(e) => setCommitMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCommit() }}
            placeholder="Commit message"
            style={{
              width: '100%', padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              transition: 'border-color 120ms ease',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
          <button
            type="button"
            onClick={handleCommit}
            disabled={!canCommit}
            style={{
              width: '100%', marginTop: 8, padding: '7px 0',
              borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600,
              background: canCommit ? 'var(--accent)' : 'var(--surface-hover)',
              color: canCommit ? '#fff' : 'var(--text-tertiary)',
              cursor: canCommit ? 'pointer' : 'default',
              transition: 'background 100ms ease, color 100ms ease',
            }}
          >
            Commit{stagedFiles.length > 0 ? ` (${stagedFiles.length})` : ''}
          </button>
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }} />

        {/* ── staged files ──────────────────────────────────── */}
        {stagedFiles.length > 0 && (
          <Section title="Staged" count={stagedFiles.length} action="Unstage all" onAction={unstageAll}>
            {stagedFiles.map((f) => (
              <FileRow key={f.path} file={f} staged onToggle={toggleStage} />
            ))}
          </Section>
        )}

        {/* ── unstaged changes ──────────────────────────────── */}
        <Section
          title="Changes"
          count={unstaged.length}
          action={unstaged.length > 0 ? 'Stage all' : undefined}
          onAction={stageAll}
        >
          {unstaged.length === 0 ? (
            <div style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>
              No changes
            </div>
          ) : (
            unstaged.map((f) => (
              <FileRow key={f.path} file={f} staged={false} onToggle={toggleStage} />
            ))
          )}
        </Section>

        <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }} />

        {/* ── history ───────────────────────────────────────── */}
        {log.length > 0 && (
          <div style={{ padding: '12px 16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 8 }}>
              History
            </div>
            {log.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', alignItems: 'baseline' }}>
                <GitCommit size={12} color="var(--text-tertiary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <code style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', flexShrink: 0 }}>{entry.hash}</code>
                <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.message}</span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}>{entry.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          padding: '8px 18px', borderRadius: 'var(--radius)', background: 'var(--text-primary)',
          color: 'var(--text-inverse)', fontSize: 13, fontWeight: 500,
          boxShadow: 'var(--shadow-lg)', zIndex: 300, animation: 'fadeIn 150ms ease',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}

/* ── small helpers ──────────────────────────────────────────── */

function Section({ title, count, action, onAction, children }: {
  title: string; count: number; action?: string; onAction?: () => void; children: React.ReactNode
}) {
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 4px', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
          {title}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{count}</span>
        <div style={{ flex: 1 }} />
        {action && (
          <button type="button" onClick={onAction} style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function FileRow({ file, staged, onToggle }: { file: FileChange; staged: boolean; onToggle: (p: string) => void }) {
  const dot = STATUS_DOT[file.status]
  const filename = file.path.split('/').pop()
  const dir = file.path.split('/').slice(0, -1).join('/')

  return (
    <button
      type="button"
      onClick={() => onToggle(file.path)}
      aria-label={staged ? `Unstage ${file.path}` : `Stage ${file.path}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, width: '100%',
        padding: '4px 16px', fontSize: 12, cursor: 'pointer', textAlign: 'left',
        transition: 'background 60ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      {staged
        ? <Minus size={13} color="var(--red)" strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden />
        : <Plus size={13} color="var(--green)" strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden />
      }
      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{filename}</span>
      {dir && <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{dir}/</span>}
      <div style={{ flex: 1 }} />
      <span style={{
        width: 16, height: 16, borderRadius: 'var(--radius-sm)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
        color: dot.color, background: `color-mix(in srgb, ${dot.color} 12%, transparent)`,
      }}>
        {dot.letter}
      </span>
    </button>
  )
}

function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)', background: 'var(--surface)',
        color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
        cursor: 'pointer', transition: 'all 80ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
    >
      {icon} {label}
    </button>
  )
}
