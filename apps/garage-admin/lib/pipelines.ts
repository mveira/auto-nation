// ---------------------------------------------------------------------------
// Single source of truth for pipelines and stages.
// Both backend and frontend import from here.
// ---------------------------------------------------------------------------

export interface StageConfig {
  key: string
  label: string
  order: number
  color: string // tailwind bg class for dot
}

export interface PipelineConfig {
  id: string
  label: string
  defaultStageKey: string
  stages: StageConfig[]
}

// ── SERVICES pipeline ────────────────────────────────────────────────────

const SERVICES_STAGES: StageConfig[] = [
  { key: 'SERVICES_NEW_ENQUIRY', label: 'New Enquiry',  order: 0, color: 'bg-blue-500' },
  { key: 'SERVICES_BOOKED',      label: 'Booked',       order: 1, color: 'bg-purple-500' },
  { key: 'SERVICES_IN_PROGRESS', label: 'In Progress',  order: 2, color: 'bg-amber-500' },
  { key: 'SERVICES_COMPLETE',    label: 'Complete',      order: 3, color: 'bg-green-500' },
  { key: 'SERVICES_CANCELLED',   label: 'Cancelled',    order: 4, color: 'bg-zinc-600' },
  { key: 'SERVICES_NO_SHOW',     label: 'No Show',      order: 5, color: 'bg-red-500' },
]

// ── SALES pipeline ───────────────────────────────────────────────────────

const SALES_STAGES: StageConfig[] = [
  { key: 'SALES_NEW_VEHICLE_ENQUIRY', label: 'New vehicle enquiry',        order: 0, color: 'bg-blue-500' },
  { key: 'SALES_CONTACTED',           label: 'Contacted',                  order: 1, color: 'bg-yellow-500' },
  { key: 'SALES_VIEWING_BOOKED',      label: 'Viewing / Test drive booked', order: 2, color: 'bg-purple-500' },
  { key: 'SALES_DEPOSIT_TAKEN',       label: 'Deposit taken',              order: 3, color: 'bg-amber-500' },
  { key: 'SALES_DEAL_AGREED',         label: 'Deal agreed',                order: 4, color: 'bg-orange-500' },
  { key: 'SALES_SOLD',                label: 'Sold',                       order: 5, color: 'bg-green-500' },
  { key: 'SALES_LEFT_REVIEW',         label: 'Left review',                order: 6, color: 'bg-emerald-500' },
  { key: 'SALES_LOST',                label: 'Lost',                       order: 7, color: 'bg-zinc-600' },
]

// ── Pipeline registry ────────────────────────────────────────────────────

export const PIPELINES: Record<string, PipelineConfig> = {
  SERVICES: {
    id: 'SERVICES',
    label: 'Services',
    defaultStageKey: 'SERVICES_BOOKED',
    stages: SERVICES_STAGES,
  },
  SALES: {
    id: 'SALES',
    label: 'Sales',
    defaultStageKey: 'SALES_NEW_VEHICLE_ENQUIRY',
    stages: SALES_STAGES,
  },
}

export const PIPELINE_IDS = Object.keys(PIPELINES) as Array<keyof typeof PIPELINES>

// ── Lookup helpers ───────────────────────────────────────────────────────

/** Get the pipeline config for a pipeline ID, or SERVICES as fallback. */
export function getPipeline(pipelineId: string): PipelineConfig {
  return PIPELINES[pipelineId] ?? PIPELINES.SERVICES
}

/** Get stage config by key. Searches all pipelines. */
export function getStage(stageKey: string): StageConfig | undefined {
  for (const p of Object.values(PIPELINES)) {
    const stage = p.stages.find(s => s.key === stageKey)
    if (stage) return stage
  }
  return undefined
}

/** Get all valid stage keys for a pipeline. */
export function getStageKeys(pipelineId: string): string[] {
  return getPipeline(pipelineId).stages.map(s => s.key)
}

/** Check if a stage key is valid for a given pipeline. */
export function isValidStageKey(pipelineId: string, stageKey: string): boolean {
  return getStageKeys(pipelineId).includes(stageKey)
}

/** Get the default stage key for a pipeline. */
export function getDefaultStageKey(pipelineId: string): string {
  return getPipeline(pipelineId).defaultStageKey
}
