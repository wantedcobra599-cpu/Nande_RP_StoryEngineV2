'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, CircleAlert, Activity } from 'lucide-react'
import { analyzeStory } from '../../lib/storyHealth'
import { useStoryStore } from '../../store/useStoryStore'

export default function StoryHealthPanel() {
  const [open, setOpen] = useState(false)
  const nodes = useStoryStore((state) => state.getNodes())
  const edges = useStoryStore((state) => state.getEdges())
  const health = useMemo(() => analyzeStory(nodes, edges), [nodes, edges])

  const errors = health.issues.filter((issue) => issue.severity === 'error').length
  const warnings = health.issues.filter((issue) => issue.severity === 'warning').length
  const healthy = errors === 0 && warnings === 0

  return (
    <div className="absolute right-4 top-4 z-20 w-72 rounded-2xl border border-white/10 bg-[#0b0b0d]/95 text-white shadow-2xl backdrop-blur-xl">
      <button onClick={() => setOpen((value) => !value)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${healthy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
          {healthy ? <CheckCircle2 size={17} /> : <Activity size={17} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-black uppercase tracking-widest">Story Health</div>
          <div className="mt-0.5 text-[10px] text-zinc-500">{health.nodes} nodes · {health.edges} links</div>
        </div>
        <ChevronDown size={15} className={`text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className="grid grid-cols-3 gap-2 border-t border-white/5 px-4 py-3">
        <Metric label="Scenes" value={health.scenes} />
        <Metric label="Choices" value={health.choices} />
        <Metric label="Linked" value={health.connectedNodes} />
      </div>

      {open && (
        <div className="border-t border-white/5 px-4 pb-4 pt-3">
          {health.issues.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 px-3 py-2 text-[10px] font-bold text-emerald-400">
              <CheckCircle2 size={14} /> Story structure looks healthy.
            </div>
          ) : (
            <div className="space-y-2">
              {health.issues.slice(0, 6).map((issue, index) => (
                <div key={`${issue.message}-${index}`} className="flex gap-2 rounded-xl bg-white/[0.03] px-3 py-2 text-[10px] leading-relaxed text-zinc-400">
                  {issue.severity === 'error' ? <CircleAlert size={14} className="mt-0.5 shrink-0 text-red-400" /> : <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" />}
                  <span>{issue.message}</span>
                </div>
              ))}
              {health.issues.length > 6 && <div className="pt-1 text-center text-[9px] text-zinc-600">+{health.issues.length - 6} more issues</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-white/[0.03] px-2 py-2 text-center"><div className="text-sm font-black">{value}</div><div className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-zinc-600">{label}</div></div>
}
