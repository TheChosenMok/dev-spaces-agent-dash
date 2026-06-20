import type { Project } from '../types'

export const mockProjects: Project[] = [
  {
    id: 'proj-inventory',
    name: 'inventory-api',
    repo: 'redhat-demos/inventory-api',
    expanded: true,
    tasks: [
      {
        id: 'task-inv-1',
        name: 'Implement product search with filtering',
        description: 'Add full-text search endpoint with category, price range, and availability filters using query parameters.',
        status: 'running',
        steps: [
          { type: 'thinking', label: 'Analyzing codebase structure', timestamp: '14:32:01' },
          { type: 'tool', label: 'Read file', detail: 'src/routes/products.ts', timestamp: '14:32:03' },
          { type: 'tool', label: 'Read file', detail: 'src/models/Product.ts', timestamp: '14:32:04' },
          { type: 'tool', label: 'Read file', detail: 'src/db/queries.ts', timestamp: '14:32:05' },
          { type: 'thinking', label: 'Planning search implementation with SQL LIKE and parameterized filters', timestamp: '14:32:07' },
          { type: 'tool', label: 'Write file', detail: 'src/routes/search.ts — new search endpoint with query parsing', timestamp: '14:32:12' },
          { type: 'tool', label: 'Edit file', detail: 'src/routes/index.ts — register search router (+3 lines)', timestamp: '14:32:14' },
          { type: 'tool', label: 'Edit file', detail: 'src/db/queries.ts — add buildSearchQuery helper (+42 lines)', timestamp: '14:32:18' },
          { type: 'tool', label: 'Write file', detail: 'src/routes/__tests__/search.test.ts — 8 test cases', timestamp: '14:32:22' },
          { type: 'command', label: 'npm test -- --grep search', timestamp: '14:32:25' },
          { type: 'output', label: '6 of 8 tests passing, 2 failing on price range edge cases', timestamp: '14:32:28' },
          { type: 'tool', label: 'Edit file', detail: 'src/db/queries.ts — fix price boundary conditions', timestamp: '14:32:31' },
        ],
        agentScript: [
          { text: '$ opencode run "implement product search with filtering"\r\n', color: '#d4d4d4' },
          { text: '\r\n', delay: 150 },
          { text: '  Analyzing codebase structure...\r\n', color: '#808080', delay: 300 },
          { text: '  Reading src/routes/products.ts\r\n', color: '#808080', delay: 200 },
          { text: '  Reading src/models/Product.ts\r\n', color: '#808080', delay: 200 },
          { text: '  Reading src/db/queries.ts\r\n', color: '#808080', delay: 200 },
          { text: '\r\n', delay: 100 },
          { text: '  Planning: SQL LIKE search with parameterized filters\r\n', color: '#569cd6', delay: 400 },
          { text: '\r\n', delay: 100 },
          { text: '  + src/routes/search.ts (new, 67 lines)\r\n', color: '#6a9955', delay: 300 },
          { text: '  ~ src/routes/index.ts (+3 lines)\r\n', color: '#dcdcaa', delay: 200 },
          { text: '  ~ src/db/queries.ts (+42 lines)\r\n', color: '#dcdcaa', delay: 200 },
          { text: '  + src/routes/__tests__/search.test.ts (new, 124 lines)\r\n', color: '#6a9955', delay: 300 },
          { text: '\r\n', delay: 100 },
          { text: '  Running tests...\r\n', color: '#808080', delay: 400 },
          { text: '  6/8 passing — fixing price range edge cases\r\n', color: '#dcdcaa', delay: 300 },
          { text: '  ~ src/db/queries.ts (fix boundary conditions)\r\n', color: '#dcdcaa', delay: 200 },
        ],
        changes: [
          {
            path: 'src/routes/search.ts',
            status: 'added',
            additions: 67,
            deletions: 0,
            hunks: `+import { Router, Request, Response } from 'express'
+import { buildSearchQuery, SearchFilters } from '../db/queries'
+import { pool } from '../db/connection'
+
+const router = Router()
+
+router.get('/search', async (req: Request, res: Response) => {
+  const filters: SearchFilters = {
+    query: req.query.q as string || '',
+    category: req.query.category as string,
+    minPrice: req.query.min_price ? Number(req.query.min_price) : undefined,
+    maxPrice: req.query.max_price ? Number(req.query.max_price) : undefined,
+    inStock: req.query.in_stock === 'true',
+    page: Math.max(1, Number(req.query.page) || 1),
+    limit: Math.min(100, Math.max(1, Number(req.query.limit) || 20)),
+  }
+
+  try {
+    const { sql, params } = buildSearchQuery(filters)
+    const result = await pool.query(sql, params)
+    const countResult = await pool.query(
+      buildSearchQuery({ ...filters, countOnly: true }).sql,
+      buildSearchQuery({ ...filters, countOnly: true }).params
+    )
+
+    res.json({
+      products: result.rows,
+      total: parseInt(countResult.rows[0].count, 10),
+      page: filters.page,
+      limit: filters.limit,
+    })
+  } catch (err) {
+    console.error('Search failed:', err)
+    res.status(500).json({ error: 'Search failed' })
+  }
+})
+
+export default router`,
          },
          {
            path: 'src/routes/index.ts',
            status: 'modified',
            additions: 3,
            deletions: 0,
            hunks: ` import productRouter from './products'
+import searchRouter from './search'
 
 const router = Router()
 
 router.use('/products', productRouter)
+router.use('/', searchRouter)
 
 export default router`,
          },
          {
            path: 'src/db/queries.ts',
            status: 'modified',
            additions: 42,
            deletions: 0,
            hunks: `+export interface SearchFilters {
+  query: string
+  category?: string
+  minPrice?: number
+  maxPrice?: number
+  inStock?: boolean
+  page: number
+  limit: number
+  countOnly?: boolean
+}
+
+export function buildSearchQuery(filters: SearchFilters) {
+  const conditions: string[] = []
+  const params: (string | number | boolean)[] = []
+  let idx = 1
+
+  if (filters.query) {
+    conditions.push(\`(name ILIKE $\${idx} OR description ILIKE $\${idx})\`)
+    params.push(\`%\${filters.query}%\`)
+    idx++
+  }
+
+  if (filters.category) {
+    conditions.push(\`category = $\${idx}\`)
+    params.push(filters.category)
+    idx++
+  }
+
+  if (filters.minPrice !== undefined) {
+    conditions.push(\`price >= $\${idx}\`)
+    params.push(filters.minPrice)
+    idx++
+  }
+
+  if (filters.maxPrice !== undefined) {
+    conditions.push(\`price <= $\${idx}\`)
+    params.push(filters.maxPrice)
+    idx++
+  }
+
+  const where = conditions.length > 0 ? \`WHERE \${conditions.join(' AND ')}\` : ''
+  const select = filters.countOnly ? 'SELECT COUNT(*)' : 'SELECT *'
+  const pagination = filters.countOnly ? '' : \`LIMIT $\${idx} OFFSET $\${idx + 1}\`
+
+  if (!filters.countOnly) {
+    params.push(filters.limit, (filters.page - 1) * filters.limit)
+  }
+
+  return { sql: \`\${select} FROM products \${where} \${pagination}\`, params }
+}`,
          },
        ],
        git: {
          branch: 'feat/product-search',
          ahead: 3,
          behind: 0,
          log: [
            { hash: 'a4c8e2f', message: 'feat: add search endpoint with query filters', time: '2 min ago' },
            { hash: 'b1d9f3a', message: 'feat: add buildSearchQuery with parameterized SQL', time: '3 min ago' },
            { hash: 'c2e0a4b', message: 'test: add search endpoint test suite', time: '4 min ago' },
          ],
        },
        editor: {
          filename: 'src/routes/search.ts',
          language: 'typescript',
          content: `import { Router, Request, Response } from 'express'
import { buildSearchQuery, SearchFilters } from '../db/queries'
import { pool } from '../db/connection'

const router = Router()

router.get('/search', async (req: Request, res: Response) => {
  const filters: SearchFilters = {
    query: req.query.q as string || '',
    category: req.query.category as string,
    minPrice: req.query.min_price ? Number(req.query.min_price) : undefined,
    maxPrice: req.query.max_price ? Number(req.query.max_price) : undefined,
    inStock: req.query.in_stock === 'true',
    page: Math.max(1, Number(req.query.page) || 1),
    limit: Math.min(100, Math.max(1, Number(req.query.limit) || 20)),
  }

  try {
    const { sql, params } = buildSearchQuery(filters)
    const result = await pool.query(sql, params)
    const countResult = await pool.query(
      buildSearchQuery({ ...filters, countOnly: true }).sql,
      buildSearchQuery({ ...filters, countOnly: true }).params
    )

    res.json({
      products: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page: filters.page,
      limit: filters.limit,
    })
  } catch (err) {
    console.error('Search failed:', err)
    res.status(500).json({ error: 'Search failed' })
  }
})

export default router
`,
        },
      },
      {
        id: 'task-inv-2',
        name: 'Add OpenAPI spec and validation middleware',
        description: 'Generate OpenAPI 3.1 spec from existing routes and wire up request/response validation.',
        status: 'queued',
        steps: [
          { type: 'thinking', label: 'Waiting in queue — will analyze route signatures to generate OpenAPI schema', timestamp: '14:34:00' },
        ],
        agentScript: [
          { text: '  Queued: Add OpenAPI spec and validation middleware\r\n', color: '#808080' },
          { text: '  Waiting for "Implement product search" to complete.\r\n', color: '#808080', delay: 200 },
        ],
        changes: [],
        git: {
          branch: 'feat/openapi-validation',
          ahead: 0,
          behind: 0,
          log: [],
        },
        editor: {
          filename: 'openapi.yaml',
          language: 'yaml',
          content: `# OpenAPI spec will be generated here
openapi: "3.1.0"
info:
  title: Inventory API
  version: "1.0.0"
paths: {}
`,
        },
      },
    ],
  },
  {
    id: 'proj-dashboard',
    name: 'ops-dashboard',
    repo: 'redhat-demos/ops-dashboard',
    expanded: true,
    tasks: [
      {
        id: 'task-dash-1',
        name: 'Build cluster health overview component',
        description: 'Create a real-time cluster health dashboard showing node status, resource utilization, and alerts from Prometheus metrics.',
        status: 'completed',
        steps: [
          { type: 'thinking', label: 'Analyzing existing component structure and API layer', timestamp: '13:45:01' },
          { type: 'tool', label: 'Read file', detail: 'src/api/prometheus.ts', timestamp: '13:45:03' },
          { type: 'tool', label: 'Read file', detail: 'src/components/Dashboard.tsx', timestamp: '13:45:04' },
          { type: 'tool', label: 'Read file', detail: 'src/hooks/useMetrics.ts', timestamp: '13:45:05' },
          { type: 'thinking', label: 'Planning component hierarchy: ClusterHealth > NodeGrid > NodeCard + ResourceGauge', timestamp: '13:45:08' },
          { type: 'tool', label: 'Write file', detail: 'src/components/ClusterHealth.tsx — main container with polling', timestamp: '13:45:15' },
          { type: 'tool', label: 'Write file', detail: 'src/components/NodeCard.tsx — individual node status card', timestamp: '13:45:20' },
          { type: 'tool', label: 'Write file', detail: 'src/components/ResourceGauge.tsx — CPU/memory/disk gauge', timestamp: '13:45:24' },
          { type: 'tool', label: 'Edit file', detail: 'src/api/prometheus.ts — add fetchClusterNodes query (+18 lines)', timestamp: '13:45:28' },
          { type: 'tool', label: 'Edit file', detail: 'src/components/Dashboard.tsx — mount ClusterHealth in grid', timestamp: '13:45:30' },
          { type: 'command', label: 'npm test', timestamp: '13:45:33' },
          { type: 'success', label: 'All 24 tests passing — 3 new files, 2 modified', timestamp: '13:45:38' },
        ],
        agentScript: [
          { text: '$ opencode run "build cluster health overview"\r\n', color: '#d4d4d4' },
          { text: '\r\n', delay: 150 },
          { text: '  Reading src/api/prometheus.ts\r\n', color: '#808080', delay: 200 },
          { text: '  Reading src/components/Dashboard.tsx\r\n', color: '#808080', delay: 200 },
          { text: '  Reading src/hooks/useMetrics.ts\r\n', color: '#808080', delay: 200 },
          { text: '\r\n', delay: 100 },
          { text: '  + src/components/ClusterHealth.tsx (new)\r\n', color: '#6a9955', delay: 300 },
          { text: '  + src/components/NodeCard.tsx (new)\r\n', color: '#6a9955', delay: 200 },
          { text: '  + src/components/ResourceGauge.tsx (new)\r\n', color: '#6a9955', delay: 200 },
          { text: '  ~ src/api/prometheus.ts (+18 lines)\r\n', color: '#dcdcaa', delay: 200 },
          { text: '  ~ src/components/Dashboard.tsx (+5 lines)\r\n', color: '#dcdcaa', delay: 200 },
          { text: '\r\n', delay: 100 },
          { text: '  All 24 tests passing\r\n', color: '#6a9955', delay: 300 },
          { text: '  Done. 3 new files, 2 modified.\r\n', color: '#6a9955', delay: 200 },
        ],
        changes: [
          {
            path: 'src/components/ClusterHealth.tsx',
            status: 'added',
            additions: 89,
            deletions: 0,
            hunks: `+import { useEffect, useState } from 'react'
+import { fetchClusterNodes, NodeMetrics } from '../api/prometheus'
+import { NodeCard } from './NodeCard'
+
+export function ClusterHealth() {
+  const [nodes, setNodes] = useState<NodeMetrics[]>([])
+  const [loading, setLoading] = useState(true)
+
+  useEffect(() => {
+    const poll = async () => {
+      const data = await fetchClusterNodes()
+      setNodes(data)
+      setLoading(false)
+    }
+    poll()
+    const interval = setInterval(poll, 15_000)
+    return () => clearInterval(interval)
+  }, [])
+
+  if (loading) return <div className="skeleton" />
+
+  const healthy = nodes.filter(n => n.status === 'Ready').length
+
+  return (
+    <section className="cluster-health">
+      <header>
+        <h2>Cluster Health</h2>
+        <span className="badge">{healthy}/{nodes.length} nodes ready</span>
+      </header>
+      <div className="node-grid">
+        {nodes.map(node => <NodeCard key={node.name} node={node} />)}
+      </div>
+    </section>
+  )
+}`,
          },
          {
            path: 'src/components/Dashboard.tsx',
            status: 'modified',
            additions: 5,
            deletions: 1,
            hunks: ` import { AlertsFeed } from './AlertsFeed'
+import { ClusterHealth } from './ClusterHealth'
 
 export function Dashboard() {
   return (
     <div className="dashboard-grid">
+      <ClusterHealth />
       <AlertsFeed />`,
          },
        ],
        git: {
          branch: 'feat/cluster-health',
          ahead: 0,
          behind: 0,
          log: [
            { hash: 'e7f1a2b', message: 'feat: add ClusterHealth with real-time polling', time: '48 min ago' },
            { hash: 'f8a2b3c', message: 'feat: add NodeCard and ResourceGauge components', time: '50 min ago' },
            { hash: 'a9b3c4d', message: 'feat: add fetchClusterNodes Prometheus query', time: '52 min ago' },
          ],
        },
        editor: {
          filename: 'src/components/ClusterHealth.tsx',
          language: 'typescript',
          content: `import { useEffect, useState } from 'react'
import { fetchClusterNodes, NodeMetrics } from '../api/prometheus'
import { NodeCard } from './NodeCard'

export function ClusterHealth() {
  const [nodes, setNodes] = useState<NodeMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const poll = async () => {
      const data = await fetchClusterNodes()
      setNodes(data)
      setLoading(false)
    }
    poll()
    const interval = setInterval(poll, 15_000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="skeleton" />

  const healthy = nodes.filter(n => n.status === 'Ready').length

  return (
    <section className="cluster-health">
      <header>
        <h2>Cluster Health</h2>
        <span className="badge">{healthy}/{nodes.length} nodes ready</span>
      </header>
      <div className="node-grid">
        {nodes.map(node => <NodeCard key={node.name} node={node} />)}
      </div>
    </section>
  )
}
`,
        },
      },
      {
        id: 'task-dash-2',
        name: 'Add pod autoscaling configuration page',
        description: 'Build a form to configure HPA policies with min/max replicas, CPU/memory targets, and scale-down stabilization.',
        status: 'failed',
        steps: [
          { type: 'thinking', label: 'Analyzing Kubernetes HPA v2 API schema', timestamp: '14:10:01' },
          { type: 'tool', label: 'Read file', detail: 'src/api/kubernetes.ts', timestamp: '14:10:03' },
          { type: 'tool', label: 'Write file', detail: 'src/components/AutoscaleConfig.tsx — form with validation', timestamp: '14:10:12' },
          { type: 'tool', label: 'Edit file', detail: 'src/api/kubernetes.ts — add applyHPA mutation', timestamp: '14:10:18' },
          { type: 'command', label: 'npm test', timestamp: '14:10:22' },
          { type: 'error', label: 'TypeError: Cannot read property \'metadata\' of undefined — HPA response schema mismatch', timestamp: '14:10:25' },
          { type: 'tool', label: 'Edit file', detail: 'src/api/kubernetes.ts — fix HPA response parsing', timestamp: '14:10:30' },
          { type: 'command', label: 'npm test', timestamp: '14:10:33' },
          { type: 'error', label: 'RBAC error: serviceaccount lacks patch permission on horizontalpodautoscalers', timestamp: '14:10:36' },
        ],
        agentScript: [
          { text: '$ opencode run "add pod autoscaling config page"\r\n', color: '#d4d4d4' },
          { text: '\r\n', delay: 150 },
          { text: '  Reading src/api/kubernetes.ts\r\n', color: '#808080', delay: 200 },
          { text: '  + src/components/AutoscaleConfig.tsx (new)\r\n', color: '#6a9955', delay: 300 },
          { text: '  ~ src/api/kubernetes.ts (+23 lines)\r\n', color: '#dcdcaa', delay: 200 },
          { text: '\r\n', delay: 100 },
          { text: '  Running tests...\r\n', color: '#808080', delay: 300 },
          { text: '  ✗ TypeError: Cannot read property \'metadata\' of undefined\r\n', color: '#f44747', delay: 300 },
          { text: '  Fixing HPA response parsing...\r\n', color: '#808080', delay: 200 },
          { text: '  ✗ RBAC error: missing patch permission on horizontalpodautoscalers\r\n', color: '#f44747', delay: 300 },
          { text: '\r\n', delay: 100 },
          { text: '  Failed: requires cluster RBAC update (see error above)\r\n', color: '#f44747', delay: 200 },
        ],
        changes: [
          {
            path: 'src/components/AutoscaleConfig.tsx',
            status: 'added',
            additions: 156,
            deletions: 0,
            hunks: `+import { useState, FormEvent } from 'react'
+import { applyHPA, HPAConfig } from '../api/kubernetes'
+
+const DEFAULT_CONFIG: HPAConfig = {
+  minReplicas: 1,
+  maxReplicas: 10,
+  cpuTarget: 70,
+  memoryTarget: 80,
+  scaleDownStabilization: 300,
+}
+
+export function AutoscaleConfig({ namespace, deployment }: Props) {
+  const [config, setConfig] = useState(DEFAULT_CONFIG)
+  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
+
+  const handleSubmit = async (e: FormEvent) => {
+    e.preventDefault()
+    setStatus('saving')
+    try {
+      await applyHPA(namespace, deployment, config)
+    } catch {
+      setStatus('error')
+    }
+  }
+  // ... form rendering
+}`,
          },
          {
            path: 'src/api/kubernetes.ts',
            status: 'modified',
            additions: 23,
            deletions: 2,
            hunks: ` import { KubeConfig, AutoscalingV2Api } from '@kubernetes/client-node'
 
+export interface HPAConfig {
+  minReplicas: number
+  maxReplicas: number
+  cpuTarget: number
+  memoryTarget: number
+  scaleDownStabilization: number
+}
+
+export async function applyHPA(ns: string, deploy: string, config: HPAConfig) {
+  const api = kc.makeApiClient(AutoscalingV2Api)
-  const existing = await api.readNamespacedHorizontalPodAutoscaler(name, ns)
+  const existing = await api.readNamespacedHorizontalPodAutoscaler(deploy, ns)
+  if (!existing.body?.metadata) throw new Error('HPA not found')
+  // ... apply patch
+}`,
          },
        ],
        git: {
          branch: 'feat/autoscale-config',
          ahead: 2,
          behind: 1,
          log: [
            { hash: 'd6e0f1a', message: 'wip: autoscale config form (RBAC issue)', time: '22 min ago' },
            { hash: 'e7f1a2b', message: 'feat: add ClusterHealth with real-time polling', time: '48 min ago' },
          ],
        },
        editor: {
          filename: 'src/api/kubernetes.ts',
          language: 'typescript',
          content: `import { KubeConfig, AutoscalingV2Api } from '@kubernetes/client-node'

const kc = new KubeConfig()
kc.loadFromDefault()

export interface HPAConfig {
  minReplicas: number
  maxReplicas: number
  cpuTarget: number
  memoryTarget: number
  scaleDownStabilization: number
}

export async function applyHPA(ns: string, deploy: string, config: HPAConfig) {
  const api = kc.makeApiClient(AutoscalingV2Api)
  const existing = await api.readNamespacedHorizontalPodAutoscaler(deploy, ns)
  if (!existing.body?.metadata) throw new Error('HPA not found')

  const patch = {
    spec: {
      minReplicas: config.minReplicas,
      maxReplicas: config.maxReplicas,
      metrics: [
        { type: 'Resource', resource: { name: 'cpu', target: { type: 'Utilization', averageUtilization: config.cpuTarget } } },
        { type: 'Resource', resource: { name: 'memory', target: { type: 'Utilization', averageUtilization: config.memoryTarget } } },
      ],
      behavior: {
        scaleDown: { stabilizationWindowSeconds: config.scaleDownStabilization },
      },
    },
  }

  return api.patchNamespacedHorizontalPodAutoscaler(deploy, ns, patch)
}
`,
        },
      },
    ],
  },
]

export const DEFAULT_TASK_ID = 'task-inv-1'
