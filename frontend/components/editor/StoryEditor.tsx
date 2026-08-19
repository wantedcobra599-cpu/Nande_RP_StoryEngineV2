'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider, Panel } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Maximize2 } from 'lucide-react'

import { useStoryStore } from '../../store/useStoryStore'
import CharacterSceneNode from '../nodes/CharacterSceneNode'
import ChoiceNode from '../nodes/ChoiceNode'
import LeftToolbox from '../panels/LeftToolbox'
import TopBar from '../panels/TopBar'
import ArcTimeline from '../timeline/ArcTimeline'
import SceneModal from './SceneModal'
import ContextMenu from './ContextMenu'
import SaveSyncModal from './SaveSyncModal'
import DeviceGuard from './DeviceGuard'
import StoryHealthPanel from './StoryHealthPanel'

const nodeTypes = { characterScene: CharacterSceneNode, choice: ChoiceNode }

function FlowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState<any>(null)
  const { getNodes, getEdges, onNodesChange, onEdgesChange, onConnect, setSelectedNode, addNode, loadArcs, deleteNode, isPresenting, togglePresentMode } = useStoryStore()
  const nodes = getNodes()
  const edges = getEdges()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = document.activeElement as HTMLElement | null
      const editing = !!target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)

      if (e.key === 'Delete' && !editing) {
        const selectedNodes = nodes.filter((n) => n.selected)
        if (selectedNodes.length > 0 && confirm(`Delete ${selectedNodes.length} node(s)?`)) selectedNodes.forEach((n) => deleteNode(n.id))
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !editing) {
        e.preventDefault()
        const temporal = (useStoryStore as any).temporal?.getState()
        if (e.shiftKey) temporal?.redo?.()
        else temporal?.undo?.()
      }

      if (e.key === 'Escape' && isPresenting) togglePresentMode()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, deleteNode, isPresenting, togglePresentMode])

  useEffect(() => {
    loadArcs()
    const interval = setInterval(() => loadArcs(), 8000)
    return () => clearInterval(interval)
  }, [loadArcs])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const type = event.dataTransfer.getData('application/reactflow')
    if (!type) return

    const charDataRaw = event.dataTransfer.getData('application/character-data')
    let initialData: Record<string, unknown> = {}
    if (charDataRaw) {
      try { initialData = JSON.parse(charDataRaw) } catch { initialData = {} }
    }

    const pane = reactFlowWrapper.current?.getBoundingClientRect()
    addNode(type, { x: event.clientX - (pane?.left || 0), y: event.clientY - (pane?.top || 0) }, initialData)
  }, [addNode])

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
    event.preventDefault()
    const pane = reactFlowWrapper.current?.getBoundingClientRect()
    if (!pane) return
    setMenu({ id: node.id, top: event.clientY - pane.top, left: event.clientX - pane.left, type: 'node' })
  }, [])

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: any) => {
    event.preventDefault()
    const pane = reactFlowWrapper.current?.getBoundingClientRect()
    if (!pane) return
    setMenu({ id: edge.id, top: event.clientY - pane.top, left: event.clientX - pane.left, type: 'edge' })
  }, [])

  const onPaneClick = useCallback(() => setMenu(null), [])
  const nodeColor = (node: any) => node.data?.color || '#ef4444'
  const nodeStrokeColor = (node: any) => node.data?.color || '#ef4444'

  return (
    <div className="flex h-screen flex-col bg-[#050505] text-white selection:bg-red-500/30">
      <DeviceGuard />
      <TopBar />
      <div className="relative flex flex-1 overflow-hidden">
        <LeftToolbox />
        <main className="relative flex-1 bg-[#050505]" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            defaultEdgeOptions={{ animated: true, style: { strokeWidth: 2.5 } }}
          >
            <Background color="#1a1a1a" gap={20} size={1} />
            <Controls className={`!overflow-hidden !rounded-lg !border-white/10 !bg-[#0d0d0d] !shadow-2xl shadow-black/50 transition-all duration-500 ${isPresenting ? '!bottom-6 !left-6' : '!bottom-10 !left-10'}`} />
            <MiniMap
              nodeColor={nodeColor}
              nodeStrokeColor={nodeStrokeColor}
              nodeStrokeWidth={3}
              nodeBorderRadius={2}
              maskColor="rgba(0, 0, 0, 0.6)"
              className={`!m-8 !h-[120px] !w-[180px] !rounded-xl !border !border-white/10 !bg-[#0d0d0d] !shadow-2xl !shadow-black/50 transition-all duration-500 ${isPresenting ? 'pointer-events-none opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              zoomable
              pannable
            />

            <StoryHealthPanel />

            <Panel position="bottom-right" className="m-8">
              <div className={`flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 backdrop-blur-md shadow-2xl transition-all duration-500 ${isPresenting ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Story Engine V2</span>
              </div>
            </Panel>

            {isPresenting && (
              <Panel position="top-right" className="!m-4">
                <button onClick={togglePresentMode} className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-[10px] font-black uppercase text-black shadow-2xl transition-all hover:bg-zinc-200">
                  <Maximize2 size={16} /> Exit Present Arc
                </button>
              </Panel>
            )}

            {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
          </ReactFlow>
        </main>
      </div>
      <ArcTimeline />
      <SceneModal />
      <SaveSyncModal />
    </div>
  )
}

export default function StoryEditor() {
  return <ReactFlowProvider><FlowEditor /></ReactFlowProvider>
}
