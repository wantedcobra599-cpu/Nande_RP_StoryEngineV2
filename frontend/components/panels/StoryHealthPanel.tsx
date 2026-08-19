'use client'

import { AlertTriangle, CheckCircle2, Activity, X } from 'lucide-react'
import { analyzeStory } from '../../lib/storyHealth'
import { useStoryStore } from '../../store/useStoryStore'

export default function StoryHealthPanel({ onClose }: { onClose: () => void }) {
  const { getNodes, getEdges } = useStoryStore()
  const health = analyzeStory(getNodes(), getEdges())

  return (
    <aside className="absolute right-4 top-4 z-20 w-80 rounded-2xl border border-white/10 bg-[#0b0b0d]/95 p-4 text-white shadow-2xl backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold">Story Health</h2>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Live analysis</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Close story health">
          <X size={15} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          ['Scenes', health.scenes],
          ['Choices', health.choices],
          ['Links', health.edges],
          ['Nodes', health.nodes],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-white/5 bg-white/[0.03] p-2 text-center">
            <div className="text-lg font-black">{value}</div>
            <div className="text-[9px] uppercase text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {health.issues.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-emerald-300">
          <CheckCircle2 size={18} />
          <div><div className="text-xs font-bold">Story looks healthy</div><div className="text-[10px] text-emerald-300/60">No structural problems found.</div></div>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-auto">
          {health.issues.map((issue, index) => (
            <div key={`${issue.message}-${index}`} className="flex gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <AlertTriangle size={15} className={issue.severity === 'error' ? 'text-red-400' : 'text-amber-400'} />
              <span className="text-[11px] leading-4 text-white/70">{issue.message}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
