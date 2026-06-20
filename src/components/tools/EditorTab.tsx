import { useState } from 'react'
import { FileCode, FolderOpen, Folder, ChevronRight, FilePlus, FileEdit } from 'lucide-react'
import type { Task, FileChange } from '../../types'

interface EditorTabProps {
  task: Task
}

interface TreeFile {
  name: string
  path: string
  status?: FileChange['status']
}

interface TreeFolder {
  name: string
  children: (TreeFile | TreeFolder)[]
  expanded: boolean
}

function buildFileTree(changes: FileChange[], editorFile: string): (TreeFile | TreeFolder)[] {
  const allPaths = new Set<string>()
  changes.forEach((c) => allPaths.add(c.path))
  if (!allPaths.has(editorFile)) allPaths.add(editorFile)

  const statusMap = new Map<string, FileChange['status']>()
  changes.forEach((c) => statusMap.set(c.path, c.status))

  const root: Map<string, TreeFile | TreeFolder> = new Map()

  for (const path of Array.from(allPaths).sort()) {
    const parts = path.split('/')
    let current = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1

      if (isFile) {
        current.set(part, { name: part, path, status: statusMap.get(path) })
      } else {
        if (!current.has(part)) {
          const folder: TreeFolder & { _children: Map<string, TreeFile | TreeFolder> } = {
            name: part,
            children: [],
            expanded: true,
            _children: new Map(),
          }
          current.set(part, folder)
        }
        const folder = current.get(part) as TreeFolder & { _children: Map<string, TreeFile | TreeFolder> }
        if (!folder._children) {
          (folder as TreeFolder & { _children: Map<string, TreeFile | TreeFolder> })._children = new Map()
        }
        current = folder._children
      }
    }
  }

  function resolve(map: Map<string, TreeFile | TreeFolder>): (TreeFile | TreeFolder)[] {
    return Array.from(map.values()).map((item) => {
      if ('children' in item) {
        const folder = item as TreeFolder & { _children?: Map<string, TreeFile | TreeFolder> }
        folder.children = folder._children ? resolve(folder._children) : []
        delete folder._children
      }
      return item
    })
  }

  return resolve(root)
}

function isFolder(item: TreeFile | TreeFolder): item is TreeFolder {
  return 'children' in item
}

const STATUS_ICON = { added: FilePlus, modified: FileEdit } as const
const STATUS_COLOR = { added: 'var(--green)', modified: 'var(--orange)', deleted: 'var(--red)' } as const

function FileTreeItem({
  item,
  depth,
  selectedPath,
  onSelect,
}: {
  item: TreeFile | TreeFolder
  depth: number
  selectedPath: string
  onSelect: (path: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  if (isFolder(item)) {
    return (
      <>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, width: '100%',
            padding: `3px 8px 3px ${8 + depth * 14}px`,
            fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer',
            background: 'transparent', textAlign: 'left',
            transition: 'background 60ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <ChevronRight
            size={11}
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 100ms ease', flexShrink: 0, opacity: 0.5 }}
          />
          {expanded ? <FolderOpen size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> : <Folder size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
          {item.name}
        </button>
        {expanded && item.children.map((child, i) => (
          <FileTreeItem key={i} item={child} depth={depth + 1} selectedPath={selectedPath} onSelect={onSelect} />
        ))}
      </>
    )
  }

  const isSelected = item.path === selectedPath
  const Icon = item.status ? STATUS_ICON[item.status as 'added' | 'modified'] ?? FileCode : FileCode
  const iconColor = item.status ? STATUS_COLOR[item.status] : 'var(--text-tertiary)'

  return (
    <button
      type="button"
      onClick={() => onSelect(item.path)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5, width: '100%',
        padding: `3px 8px 3px ${8 + depth * 14}px`,
        fontSize: 12, cursor: 'pointer', textAlign: 'left',
        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontWeight: isSelected ? 500 : 400,
        background: isSelected ? 'var(--accent-bg)' : 'transparent',
        borderRadius: 'var(--radius-sm)',
        transition: 'background 60ms ease',
      }}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--surface-hover)' }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = isSelected ? 'var(--accent-bg)' : 'transparent' }}
    >
      <Icon size={13} style={{ color: iconColor, flexShrink: 0 }} strokeWidth={1.75} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
    </button>
  )
}

export function EditorTab({ task }: EditorTabProps) {
  return <EditorTabInner key={task.id} task={task} />
}

function EditorTabInner({ task }: EditorTabProps) {
  const [selectedFile, setSelectedFile] = useState(task.editor.filename)
  const [content, setContent] = useState(task.editor.content)

  const tree = buildFileTree(task.changes, task.editor.filename)

  const handleSelectFile = (path: string) => {
    setSelectedFile(path)
    const change = task.changes.find((c) => c.path === path)
    if (change) {
      const lines = change.hunks.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1))
      setContent(lines.join('\n') || `// ${path}\n`)
    } else if (path === task.editor.filename) {
      setContent(task.editor.content)
    } else {
      setContent(`// ${path}\n`)
    }
  }

  const lineCount = content.split('\n').length

  return (
    <div style={{ height: '100%', display: 'flex', minHeight: 0 }}>
      {/* File tree sidebar */}
      <div
        style={{
          width: 200, flexShrink: 0, borderRight: '1px solid var(--border)',
          background: 'var(--surface-inset)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '10px 12px 6px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>
          Files
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '2px 4px' }}>
          {tree.map((item, i) => (
            <FileTreeItem key={i} item={item} depth={0} selectedPath={selectedFile} onSelect={handleSelectFile} />
          ))}
        </div>
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* File tab bar */}
        <div
          style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface)', fontSize: 12,
          }}
        >
          <FileCode size={13} color="var(--accent)" strokeWidth={1.75} />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-primary)' }}>{selectedFile}</span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 11, marginLeft: 'auto' }}>{lineCount} lines</span>
        </div>
        {/* Editor body */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          <div
            style={{
              flexShrink: 0, padding: '10px 0', width: 44,
              textAlign: 'right', fontSize: 12, fontFamily: 'var(--font-mono)',
              color: 'var(--text-tertiary)', lineHeight: '22px',
              background: 'var(--surface-inset)', borderRight: '1px solid var(--border-subtle)',
              overflow: 'hidden', userSelect: 'none',
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} style={{ paddingRight: 10 }}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1, minHeight: 0, width: '100%',
              padding: '10px 16px', border: 'none', outline: 'none', resize: 'none',
              background: 'var(--surface)', color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: '22px',
              tabSize: 2,
            }}
          />
        </div>
      </div>
    </div>
  )
}
