'use client'

import { Plus, User, GitBranch, Search } from 'lucide-react'
import { useReactFlow } from 'reactflow'
import { useStoryStore } from '../../store/useStoryStore'
import { useCharacterCatalog } from '../../store/useCharacterCatalog'
import { useState } from 'react'

export default function LeftToolbox() {
  const { addNode, isPresenting } = useStoryStore()
  const { project } = useReactFlow()
  const characters = useCharacterCatalog()
  const [query, setQuery] = useState('')
  const filtered = characters.filter(c => c.status !== 'dead' && c.name.toLowerCase().includes(query.toLowerCase()))

  const center = () => project({ x: (window.innerWidth / 2) - 300, y: (window.innerHeight / 2) - 100 })
  const addCharacter = (char: typeof characters[number]) => addNode('characterScene', center(), { character: char.name, color: char.color, title: `${char.name}'s Scene`, characterId: char.id })
  const addChoice = () => addNode('choice', center(), { character: 'System', color: '#ec4899', title: 'Decision Point' })

  return (
    <aside className={`w-64 border-r border-white/5 bg-[#0d0d0d] flex flex-col z-20 relative transition-all duration-500 ${isPresenting ? '-translate-x-full opacity-0 invisible' : 'translate-x-0 opacity-100 visible'}`}>
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="mb-5 flex items-center gap-2 text-zinc-500"><Plus size={14}/><h2 className="text-[10px] font-bold uppercase tracking-widest">Create Arc Elements</h2></div>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3"><Search size={13} className="text-white/30"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find character..." className="w-full bg-transparent py-2 text-[10px] outline-none placeholder:text-white/25"/></div>
        <div className="grid grid-cols-2 gap-2">
          {filtered.map(char => <button key={char.id} onClick={()=>addCharacter(char)} className="group flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-3 text-center transition-all hover:border-white/20 hover:bg-white/10"><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition-transform group-hover:scale-110" style={{backgroundColor:`${char.color}20`,color:char.color,borderColor:`${char.color}40`}}><User size={20}/></div><span className="w-full truncate text-[9px] font-black uppercase tracking-tighter text-white">{char.name}</span><span className="mt-1 w-full truncate text-[7px] uppercase text-white/30">{char.role}</span></button>)}
        </div>
        {filtered.length === 0 && <p className="py-8 text-center text-[10px] text-white/30">No characters found</p>}
        <div className="mt-6 border-t border-white/5 pt-4"><button onClick={addChoice} className="group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:border-pink-500/50 hover:bg-pink-500/5"><div className="rounded-lg bg-pink-500/10 p-2 text-pink-500"><GitBranch size={18}/></div><div className="text-left"><p className="text-[10px] font-bold uppercase text-white">Decision Point</p><p className="text-[8px] font-medium uppercase text-zinc-500">Create a choice branch</p></div></button></div>
      </div>
      <div className="border-t border-white/5 bg-black/20 p-4"><div className="flex items-center gap-2 px-2"><div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"/><span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Workspace Optimized</span></div></div>
    </aside>
  )
}
