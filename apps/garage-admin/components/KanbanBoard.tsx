'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import { LeadCard, type LeadData } from './LeadCard'
import { LeadDetail } from './LeadDetail'
import { CreateLeadModal } from './CreateLeadModal'
import { Loader2, RefreshCw, Plus } from 'lucide-react'
import { PIPELINES, type StageConfig } from '@/lib/pipelines'

type Columns = Record<string, LeadData[]>

export function KanbanBoard() {
  const [columns, setColumns] = useState<Columns>({})
  const [stages, setStages] = useState<StageConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [activePipeline, setActivePipeline] = useState('SERVICES')
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchBoard = useCallback(async (pipeline?: string) => {
    const p = pipeline || activePipeline
    try {
      const res = await fetch(`/api/admin/board?pipeline=${p}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setColumns(data.columns)
      setStages(data.stages)
    } catch (err) {
      console.error('Board fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [activePipeline])

  useEffect(() => {
    setLoading(true)
    fetchBoard()
  }, [fetchBoard])

  function switchPipeline(pipeline: string) {
    setActivePipeline(pipeline)
    setLoading(true)
    fetchBoard(pipeline)
  }

  async function handleMove(leadId: string, newStageKey: string) {
    // Optimistic update
    const newColumns = { ...columns }
    let movedLead: LeadData | undefined

    for (const stage of stages) {
      const idx = newColumns[stage.key]?.findIndex(l => l.id === leadId) ?? -1
      if (idx >= 0) {
        [movedLead] = newColumns[stage.key].splice(idx, 1)
        break
      }
    }

    if (movedLead) {
      movedLead.stageKey = newStageKey
      newColumns[newStageKey] = [movedLead, ...(newColumns[newStageKey] || [])]
      setColumns({ ...newColumns })
    }

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageKey: newStageKey }),
      })
      if (!res.ok) throw new Error('Move failed')
    } catch (err) {
      console.error('Move error:', err)
      fetchBoard()
    }
  }

  async function handleDragEnd(result: DropResult) {
    const { draggableId, source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const srcStageKey = source.droppableId
    const destStageKey = destination.droppableId

    // Optimistic update
    const newColumns = { ...columns }
    const srcItems = [...(newColumns[srcStageKey] || [])]
    const destItems = srcStageKey === destStageKey ? srcItems : [...(newColumns[destStageKey] || [])]

    const [moved] = srcItems.splice(source.index, 1)
    moved.stageKey = destStageKey
    destItems.splice(destination.index, 0, moved)

    newColumns[srcStageKey] = srcItems
    if (srcStageKey !== destStageKey) {
      newColumns[destStageKey] = destItems
    }
    setColumns(newColumns)

    // Persist
    try {
      const res = await fetch(`/api/admin/leads/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageKey: destStageKey }),
      })
      if (!res.ok) throw new Error('Stage update failed')
    } catch (err) {
      console.error('Stage update error:', err)
      fetchBoard()
    }
  }

  async function selectLeadDetail(lead: LeadData) {
    // Start with card data immediately, then fetch full detail with payments
    setSelectedLead(lead)
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`)
      if (res.ok) {
        const full = await res.json()
        setSelectedLead(full)
      }
    } catch {}
  }

  function handleLeadCreated(lead: LeadData) {
    const defaultKey = PIPELINES[activePipeline]?.defaultStageKey || stages[0]?.key
    if (defaultKey) {
      setColumns(prev => ({
        ...prev,
        [defaultKey]: [lead, ...(prev[defaultKey] || [])],
      }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <>
      {/* Pipeline tabs + actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {Object.values(PIPELINES).map((p) => (
            <button
              key={p.id}
              onClick={() => switchPipeline(p.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                activePipeline === p.id
                  ? 'bg-brand text-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 text-sm bg-brand text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-brand/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Lead
          </button>
          <button
            onClick={() => { setLoading(true); fetchBoard() }}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Board columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 160px)' }}>
          {stages.map((stage) => (
            <div key={stage.key} className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-400">
                  {stage.label}
                </h2>
                <span className="text-xs text-zinc-600 ml-auto">
                  {columns[stage.key]?.length || 0}
                </span>
              </div>

              <Droppable droppableId={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[200px] rounded-xl p-2 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-zinc-800/50 ring-1 ring-brand/20' : 'bg-zinc-900/50'
                    }`}
                  >
                    {(columns[stage.key] || []).map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'opacity-90 rotate-1' : ''}
                          >
                            <LeadCard
                              lead={lead}
                              stages={stages}
                              onClick={selectLeadDetail}
                              onMove={handleMove}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onPaymentUpdate={async () => {
            // Re-fetch the lead detail to get updated payments
            try {
              const res = await fetch(`/api/admin/leads/${selectedLead.id}`)
              if (res.ok) {
                const updated = await res.json()
                setSelectedLead(updated)
              }
            } catch {}
          }}
        />
      )}

      {showCreateModal && (
        <CreateLeadModal
          pipeline={activePipeline}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleLeadCreated}
        />
      )}
    </>
  )
}
