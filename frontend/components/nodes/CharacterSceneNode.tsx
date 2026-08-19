'use client'

import { Handle, Position } from '@xyflow/react'
import { User, Settings, MapPin, Camera, MessageSquare, Clock3 } from 'lucide-react'

export default function CharacterSceneNode({ id, data, selected }: any) {
  const charColor = data.color || '#ef4444'
  const openEditor = (e: any) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-scene-modal', { detail: { nodeId: id } })) }
  return <div className={`w-72 overflow-hidden rounded-2xl border bg-[#0d0d0d] shadow-2xl transition-all duration-300 ${selected ? 'shadow-[0_0_28px_-5px_rgba(255,255,255,.15)]' : 'border-white/5'}`} style={{borderColor:selected?charColor:'rgba(255,255,255,.05)',boxShadow:selected?`0 0 24px -6px ${charColor}50`:''}}>
    <Handle type="target" position={Position.Left} className="!h-8 !w-2 !rounded-r-md !border-none !-left-[1px]" style={{backgroundColor:charColor}}/>
    <div className="flex items-center justify-between border-b border-white/5 px-3 py-2" style={{backgroundColor:`${charColor}10`}}><div className="flex items-center gap-2"><span className="rounded-md bg-white/5 p-1" style={{color:charColor}}><User size={12}/></span><span className="text-[9px] font-black uppercase tracking-widest">{data.character || 'System'}</span></div><button onClick={openEditor} className="rounded p-1 text-zinc-500 hover:bg-white/5 hover:text-white"><Settings size={12}/></button></div>
    <div className="p-4"><h3 className="line-clamp-2 text-[11px] font-bold uppercase tracking-tight">{data.title || 'Untitled Scene'}</h3>{data.description&&<p className="mt-2 line-clamp-2 text-[9px] leading-4 text-zinc-500">{data.description}</p>}
      <div className="mt-3 grid grid-cols-2 gap-1.5">{data.location&&<span className="flex items-center gap-1 rounded-md bg-white/[.03] px-2 py-1.5 text-[8px] text-zinc-400"><MapPin size={10}/> {data.location}</span>}{data.camera&&<span className="flex items-center gap-1 rounded-md bg-white/[.03] px-2 py-1.5 text-[8px] text-zinc-400"><Camera size={10}/> {data.camera}</span>}{data.dialogue&&<span className="flex items-center gap-1 rounded-md bg-white/[.03] px-2 py-1.5 text-[8px] text-zinc-400"><MessageSquare size={10}/> Dialogue</span>}{data.duration&&<span className="flex items-center gap-1 rounded-md bg-white/[.03] px-2 py-1.5 text-[8px] text-zinc-400"><Clock3 size={10}/> {data.duration}</span>}</div>
    </div>
    <Handle type="source" position={Position.Right} className="!h-8 !w-2 !rounded-l-md !border-none !-right-[1px]" style={{backgroundColor:charColor}}/>
  </div>
}
