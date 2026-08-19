'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Save, User, FileText, Layout, Plus, Minus, GitBranch, MapPin, Clapperboard } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'

export default function SceneModal() {
  const { arcGraphs, currentArcId, updateNodeData, deleteNode } = useStoryStore()
  const [isOpen, setIsOpen] = useState(false)
  const [nodeId, setNodeId] = useState<string | null>(null)
  const [nodeType, setNodeType] = useState('characterScene')
  const [editData, setEditData] = useState({ title:'', description:'', character:'', color:'', options:[] as string[], location:'', action:'', dialogue:'', camera:'', duration:'' })

  useEffect(() => {
    const handleOpen = (e: any) => {
      const id = e.detail.nodeId; const node = arcGraphs[currentArcId]?.nodes.find(n=>n.id===id); if (!node) return
      setNodeId(id); setNodeType(node.type || 'characterScene'); setEditData({ title:node.data.title||'', description:node.data.description||'', character:node.data.character||'System', color:node.data.color||'#ffffff', options:node.data.options||[], location:node.data.location||'', action:node.data.action||'', dialogue:node.data.dialogue||'', camera:node.data.camera||'', duration:node.data.duration||'' }); setIsOpen(true)
    }
    window.addEventListener('open-scene-modal', handleOpen); return ()=>window.removeEventListener('open-scene-modal', handleOpen)
  }, [arcGraphs,currentArcId])

  const save = () => { if(!nodeId) return; updateNodeData(nodeId,{...editData, options:nodeType==='choice'?editData.options:undefined}); setIsOpen(false) }
  const remove = () => { if(nodeId && confirm('Delete this node from the workspace?')) { deleteNode(nodeId); setIsOpen(false) } }
  const update = (key:string,value:string) => setEditData(d=>({...d,[key]:value}))
  if(!isOpen) return null

  return <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"><div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] text-white shadow-2xl">
    <div className="flex items-center justify-between border-b border-white/5 p-5"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{color:editData.color,background:`${editData.color}15`,border:`1px solid ${editData.color}30`}}>{nodeType==='choice'?<GitBranch size={17}/>:<Clapperboard size={17}/>}</div><div><p className="text-[8px] font-black uppercase tracking-[.2em] text-zinc-600">{nodeType==='choice'?'Decision Point':'Scene Editor'}</p><p className="text-xs font-black uppercase tracking-widest">{editData.character}</p></div></div><button onClick={()=>setIsOpen(false)} className="rounded-xl p-2 text-zinc-500 hover:bg-white/5 hover:text-white"><X size={18}/></button></div>
    <div className="flex-1 space-y-6 overflow-y-auto p-6">
      <div className="grid gap-4 md:grid-cols-2"><div><label className="mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-zinc-600"><Layout size={12}/> Scene Title</label><input value={editData.title} onChange={e=>update('title',e.target.value)} placeholder="Cinematic Name..." className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-bold outline-none focus:border-red-500/50"/></div><div><label className="mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-zinc-600"><MapPin size={12}/> Location</label><input value={editData.location} onChange={e=>update('location',e.target.value)} placeholder="e.g. Legion Square" className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm outline-none focus:border-red-500/50"/></div></div>
      <div className="grid gap-4 md:grid-cols-3"><div><label className="mb-2 block text-[8px] font-bold uppercase tracking-widest text-zinc-600">Action</label><input value={editData.action} onChange={e=>update('action',e.target.value)} placeholder="What happens?" className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs outline-none focus:border-red-500/50"/></div><div><label className="mb-2 block text-[8px] font-bold uppercase tracking-widest text-zinc-600">Camera</label><input value={editData.camera} onChange={e=>update('camera',e.target.value)} placeholder="Wide / close-up / drone" className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs outline-none focus:border-red-500/50"/></div><div><label className="mb-2 block text-[8px] font-bold uppercase tracking-widest text-zinc-600">Duration</label><input value={editData.duration} onChange={e=>update('duration',e.target.value)} placeholder="00:30" className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs outline-none focus:border-red-500/50"/></div></div>
      <div><label className="mb-2 block text-[8px] font-bold uppercase tracking-widest text-zinc-600">Dialogue / Voice Lines</label><textarea value={editData.dialogue} onChange={e=>update('dialogue',e.target.value)} placeholder="Character dialogue, radio calls, narration..." className="min-h-28 w-full resize-none rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm leading-6 text-zinc-300 outline-none focus:border-red-500/50"/></div>
      <div><label className="mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-zinc-600"><FileText size={12}/> Scene Narrative</label><textarea value={editData.description} onChange={e=>update('description',e.target.value)} placeholder="Describe the sequence, actions, dialogue pointers and story consequences..." className="min-h-56 w-full resize-none rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm leading-6 text-zinc-300 outline-none focus:border-red-500/50"/></div>
      {nodeType==='choice' && <div><div className="mb-3 flex items-center justify-between"><label className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-zinc-600"><GitBranch size={12}/> Decision Paths</label><button onClick={()=>setEditData(d=>({...d,options:[...d.options,`New Option ${d.options.length+1}`]}))} className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-[8px] font-black uppercase text-emerald-400"><Plus size={10}/> Add Path</button></div><div className="grid gap-2 md:grid-cols-2">{editData.options.map((opt,i)=><div key={i} className="flex gap-2"><input value={opt} onChange={e=>setEditData(d=>({...d,options:d.options.map((x,j)=>j===i?e.target.value:x)}))} className="flex-1 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs outline-none"/><button onClick={()=>setEditData(d=>({...d,options:d.options.filter((_,j)=>j!==i)}))} className="rounded-lg bg-red-500/10 p-2 text-red-400"><Minus size={12}/></button></div>)}</div></div>}
    </div>
    <div className="flex items-center justify-between border-t border-white/5 bg-black/30 p-5"><button onClick={remove} className="flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-zinc-500 hover:text-red-400"><Trash2 size={15}/> Delete Node</button><div className="flex gap-2"><button onClick={()=>setIsOpen(false)} className="rounded-xl px-6 py-2 text-[10px] font-black uppercase text-zinc-400 hover:bg-white/5">Cancel</button><button onClick={save} className="flex items-center gap-2 rounded-xl bg-white px-7 py-2.5 text-[10px] font-black uppercase text-black hover:bg-zinc-200"><Save size={15}/> Save Scene</button></div></div>
  </div></div>
}
