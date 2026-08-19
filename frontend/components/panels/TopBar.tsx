'use client'

import { useState } from 'react'
import { Save, Play, Settings, Loader2, Check, Cloud, Users } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'
import CharacterManager from './CharacterManager'

export default function TopBar() {
  const { arcs, currentArcId, saveCurrentArc, isPresenting, togglePresentMode } = useStoryStore()
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [showCharacters, setShowCharacters] = useState(false)
  const currentArc = arcs.find(a => a.id === currentArcId)

  const handleManualSave = async () => {
    setIsSaving(true); await saveCurrentArc(); setIsSaving(false); setShowSaved(true); setTimeout(() => setShowSaved(false), 2000)
  }

  return (
    <>
      <header className={`h-16 border-b border-white/5 bg-[#0d0d0d] flex items-center justify-between px-6 z-30 relative transition-all duration-500 ${isPresenting ? '-translate-y-full opacity-0 invisible' : ''}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-red-500/10"><img src="/logo.jpg" alt="Nande RP Logo" className="w-full h-full object-cover" /></div><div><h1 className="text-sm font-black tracking-[0.2em] text-white uppercase italic">Nande RP <span className="text-red-500 not-italic">Story Engine</span></h1><div className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"/><span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">V2 · Arc Mode</span></div></div></div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2"><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Arc:</span><span className="text-[10px] font-black text-white uppercase tracking-tighter bg-white/5 px-2 py-1 rounded border border-white/5">{currentArc?.title || 'No Arc Selected'}</span></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 mr-2"><Cloud size={14} className="text-zinc-500"/><span className="text-[9px] font-bold text-zinc-500 uppercase">Manual Sync</span></div>
          <button onClick={()=>setShowCharacters(true)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase text-white hover:bg-white/10"><Users size={15}/> Characters</button>
          <button onClick={handleManualSave} disabled={isSaving} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-xl active:scale-95 ${showSaved?'bg-emerald-500 text-white':'bg-white text-black hover:bg-zinc-200'}`}>{isSaving?<Loader2 size={16} className="animate-spin"/>:(showSaved?<Check size={16}/>:<Save size={16}/>) }<span>{showSaved?'Arc Saved':isSaving?'Syncing...':'Save Arc'}</span></button>
          <button onClick={togglePresentMode} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase"><Play size={14} fill="currentColor"/><span>Present Arc</span></button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"><Settings size={18}/></button>
        </div>
      </header>
      {showCharacters && <CharacterManager onClose={()=>setShowCharacters(false)} />}
    </>
  )
}
