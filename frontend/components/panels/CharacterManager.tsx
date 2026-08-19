'use client'

import { useMemo, useState } from 'react'
import { Plus, Search, User, X, Heart, Brain, Shield, Trash2 } from 'lucide-react'

type CharacterStatus = 'active' | 'missing' | 'dead' | 'inactive'
type Character = { id: string; name: string; role: string; color: string; status: CharacterStatus; bio: string; tags: string[] }

const starterCharacters: Character[] = [
  { id: 'redparasite', name: 'RedParasite', role: 'Crew Leader', color: '#ef4444', status: 'active', bio: 'Story protagonist and crew leader.', tags: ['leader', 'criminal'] },
  { id: 'aj', name: 'AJ', role: 'Associate', color: '#3b82f6', status: 'active', bio: 'Trusted associate.', tags: ['friend'] },
  { id: 'chitty', name: 'Chitty', role: 'Crew Member', color: '#60a5fa', status: 'active', bio: 'Crew member with a complicated history.', tags: ['crew'] },
  { id: 'sanju', name: 'Sanju', role: 'Crew Member', color: '#10b981', status: 'active', bio: 'Part of the main storyline.', tags: ['crew'] },
]

export default function CharacterManager({ onClose }: { onClose: () => void }) {
  const [characters, setCharacters] = useState(starterCharacters)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Character | null>(characters[0])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')

  const filtered = useMemo(() => characters.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.role.toLowerCase().includes(query.toLowerCase())), [characters, query])
  const addCharacter = () => {
    if (!name.trim()) return
    const character = { id: `${Date.now()}`, name: name.trim(), role: 'New Character', color: '#a855f7', status: 'active' as CharacterStatus, bio: 'Add character background and story details.', tags: [] }
    setCharacters(prev => [...prev, character]); setSelected(character); setName(''); setShowForm(false)
  }

  return (
    <div className="absolute inset-0 z-50 flex bg-black/70 backdrop-blur-sm">
      <section className="ml-auto flex h-full w-full max-w-5xl border-l border-white/10 bg-[#09090b] text-white shadow-2xl">
        <div className="flex w-80 flex-col border-r border-white/10 bg-[#0d0d0f]">
          <div className="flex items-center justify-between border-b border-white/10 p-5"><div><h2 className="text-sm font-black uppercase tracking-widest">Characters</h2><p className="mt-1 text-[10px] text-white/40">Story cast & memory</p></div><button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10"><X size={16}/></button></div>
          <div className="p-4"><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3"><Search size={14} className="text-white/30"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search characters..." className="w-full bg-transparent py-2.5 text-xs outline-none placeholder:text-white/25"/></div></div>
          <div className="flex-1 space-y-1 overflow-auto px-3 pb-3">
            {filtered.map(c => <button key={c.id} onClick={()=>setSelected(c)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selected?.id===c.id?'bg-white/10':'hover:bg-white/5'}`}><span className="flex h-10 w-10 items-center justify-center rounded-full border" style={{color:c.color,borderColor:`${c.color}55`,background:`${c.color}15`}}><User size={18}/></span><span className="min-w-0 flex-1"><b className="block truncate text-xs">{c.name}</b><small className="text-[9px] uppercase tracking-wider text-white/35">{c.role}</small></span><span className={`h-2 w-2 rounded-full ${c.status==='active'?'bg-emerald-400':c.status==='dead'?'bg-red-500':'bg-amber-400'}`}/></button>)}
          </div>
          <div className="border-t border-white/10 p-4"><button onClick={()=>setShowForm(true)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-zinc-200"><Plus size={15}/> New Character</button></div>
        </div>
        <div className="flex-1 overflow-auto p-8">
          {selected ? <><div className="flex items-start justify-between"><div className="flex items-center gap-4"><span className="flex h-16 w-16 items-center justify-center rounded-2xl border" style={{color:selected.color,borderColor:`${selected.color}55`,background:`${selected.color}15`}}><User size={30}/></span><div><h1 className="text-2xl font-black">{selected.name}</h1><p className="text-xs uppercase tracking-widest text-white/35">{selected.role} · {selected.status}</p></div></div><button className="rounded-lg p-2 text-white/30 hover:bg-white/5 hover:text-red-400"><Trash2 size={16}/></button></div>
            <p className="mt-8 max-w-2xl text-sm leading-6 text-white/55">{selected.bio}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Heart size={18} className="text-pink-400"/><h3 className="mt-4 text-xs font-bold">Relationships</h3><p className="mt-1 text-[10px] text-white/35">Friends, enemies, family and rivals.</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Brain size={18} className="text-violet-400"/><h3 className="mt-4 text-xs font-bold">Memories</h3><p className="mt-1 text-[10px] text-white/35">Important events this character remembers.</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Shield size={18} className="text-emerald-400"/><h3 className="mt-4 text-xs font-bold">Continuity</h3><p className="mt-1 text-[10px] text-white/35">Track status and story appearances.</p></div></div>
            <div className="mt-8"><h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Tags</h3><div className="mt-3 flex flex-wrap gap-2">{selected.tags.map(t=><span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] uppercase text-white/50">{t}</span>)}</div></div>
          </> : <div className="flex h-full items-center justify-center text-sm text-white/30">Select a character</div>}
        </div>
      </section>
      {showForm && <div className="absolute inset-0 flex items-center justify-center bg-black/60"><div className="w-96 rounded-2xl border border-white/10 bg-[#111113] p-6 shadow-2xl"><h3 className="text-sm font-black uppercase tracking-widest">New Character</h3><input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCharacter()} placeholder="Character name" className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-red-500/50"/><div className="mt-5 flex justify-end gap-2"><button onClick={()=>setShowForm(false)} className="rounded-xl px-4 py-2 text-xs text-white/50">Cancel</button><button onClick={addCharacter} className="rounded-xl bg-white px-5 py-2 text-xs font-bold text-black">Create</button></div></div></div>}
    </div>
  )
}
