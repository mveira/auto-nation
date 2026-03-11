import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPipeline, PIPELINE_IDS } from '@/lib/pipelines'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pipelineParam = request.nextUrl.searchParams.get('pipeline') || 'SERVICES'
  const pipelineId = PIPELINE_IDS.includes(pipelineParam) ? pipelineParam : 'SERVICES'
  const pipeline = getPipeline(pipelineId)

  const leads = await prisma.lead.findMany({
    where: { clientId: session.clientId, pipeline: pipelineId },
    include: {
      motReport: true,
      ghlLink: { select: { syncStatus: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Group leads by stageKey
  const columns: Record<string, typeof leads> = {}
  for (const stage of pipeline.stages) {
    columns[stage.key] = []
  }

  for (const lead of leads) {
    if (columns[lead.stageKey]) {
      columns[lead.stageKey].push(lead)
    } else {
      // Unknown stage — put in default
      columns[pipeline.defaultStageKey].push(lead)
    }
  }

  return NextResponse.json({
    columns,
    stages: pipeline.stages,
    pipeline: pipelineId,
  })
}
