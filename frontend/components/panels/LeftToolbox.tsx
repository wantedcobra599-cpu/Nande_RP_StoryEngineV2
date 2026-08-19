'use client'

import { Plus, User, GitBranch, Search, Clapperboard, Sparkles } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { useStoryStore } from '../../store/useStoryStore'
import { useCharacterCatalog } from '../../store/useCharacterCatalog'
import { useState } from 'react'

export default function LeftToolbox() {
  const { addNode, isPresenting } = useStoryStore()
  const { screenToFlowPosition } = useReactFlow()
  const characters = useCharacterCatalog()
  const [query, setQuery] = useState('')
  const [section, setSection] = useState<'characters'|'tools'>('characters')

  const filtered = characters.filter(c => c.status !== 'dead' && c.name.toLowerCase().includes(query.toLowerCase()))
  const center = () => screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const addCharacter = (c: any) => addNode('characterScene', center(), { character: c.name, color: c.color, title: `${c.name}'s Scene`, characterId: c.id })
  const addChoice = () => addNode('choice', center(), { character: 'System', color: '#ec4899', title: 'Decision Point', options: ['Path A', 'Path B'] })
  const addScene = () => addNode('characterScene', center(), { character: 'System', color: '#ef4444', title: 'New Scene' })

  return <aside className={`w-64 border-r border-white/5 bg-[#0d0d0d] flex flex-col z-20 relative transition-all duration-500 ${isPresenting?'-translate-x-full opacity-0 invisible':'translate-x-0 opacity-100 visible'}`}>
    <div className="border-b border-white/5 p-4"><div className="mb-4 flex items-center gap-2 text-zinc-500"><Plus size={14}/><h2 className="text-[10px] font-bold uppercase tracking-widest">Create Arc Elements</h2></div><div className="grid grid-cols-2 gap-1 rounded-xl bg-black/30 p-1"><button onClick={()=>setSection('characters')} className={`rounded-lg py-2 text-[8px] font-black uppercase ${section==='characters'?'bg-white text-black':'text-zinc-500'}`}>Characters</button><button onClick={()=>setSection('tools')} className={`rounded-lg py-2 text-[8px] font-black uppercase ${section==='tools'?'bg-white text-black':'text-zinc-500'}`}>Elements</button></div></div>
    <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
      {section==='characters'?<><div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3"><Search size={13} className="text-white/30"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find character..." className="w-full bg-transparent py-2.5 text-[10px] outline-none placeholder:text-white/25"/></div><div className="mb-3 flex items-center justify-between"><span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">Cast</span><span className="text-[8px] text-zinc-700">{filtered.length} available</span></div><div className="grid grid-cols-2 gap-2">{filtered.map(char=><button key={char.id} draggable onDragStart={e=>{e.dataTransfer.setData('application/reactflow','characterScene');e.dataTransfer.setData('application/character-data',JSON.stringify({character:char.name,color:char.color,title:`${char.name}'s Scene`,characterId:char.id}))}} onClick={()=>addCharacter(char)} className="group flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-3 text-center transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition-transform group-hover:scale-110" style={{backgroundColor:`${char.color}20`,color:char.color,borderColor:`${char.color}40`}}><User size={20}/></div><span className="w-full truncate text-[9px] font-black uppercase tracking-tighter">{char.name}</span><span className="mt-1 w-full truncate text-[7px] uppercase text-white/30">{char.role}</span></button>)}</div></>:<div className="space-y-2"><button onClick={addScene} className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-left hover:border-red-500/40 hover:bg-red-500/5"><Clapperboard className="text-red-400" size={18}/><span><b className="block text-[10px] uppercase">Blank Scene</b><small className="text-[8px] text-zinc-600">Start a cinematic scene</small></span></button><button onClick={addChoice} className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-left hover:border-pink-500/40 hover:bg-pink-500/5"><GitBranch className="text-pink-400" size={18}/><span><b className="block text-[10px] uppercase">Decision Point</b><small className="text-[8px] text-zinc-600">Create branching paths</small></span></button><button onClick={()=>window.dispatchEvent(new CustomEvent('open-story-health'))} className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-left hover:border-violet-500/40 hover:bg-violet-500/5"><Sparkles className="text-violet-400" size={18}/><span><b className="block text-[10px] uppercase">Story Analysis</b><small className="text-[8px] text-zinc-600">Check continuity</small></span></button></div>}
    </div>
    <div className="border-t border-white/5 bg-black/20 p-4"><div className="flex items-center gap-2 px-2"><div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"/><span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Workspace Optimized</span></div></div>
  </aside>
}
