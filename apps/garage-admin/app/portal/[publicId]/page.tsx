import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { CheckCircle, Clock, Truck, Wrench, PhoneCall, XCircle, Star, Ban } from 'lucide-react'

// Maps stage keys → customer-facing labels. Covers both pipelines.
const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; description: string }> = {
  // SERVICES
  SERVICES_BOOKED:      { label: 'Booked',      icon: CheckCircle, color: 'text-purple-400', description: 'Your appointment is confirmed. We look forward to seeing you.' },
  SERVICES_IN_PROGRESS: { label: 'In Progress', icon: Wrench,     color: 'text-amber-400',  description: 'Your vehicle is currently being worked on.' },
  SERVICES_COMPLETE:    { label: 'Complete',     icon: Truck,      color: 'text-green-400',  description: 'Work is complete. Your vehicle is ready for collection.' },
  SERVICES_CANCELLED:   { label: 'Cancelled',   icon: XCircle,    color: 'text-zinc-500',   description: 'This booking has been cancelled.' },
  SERVICES_NO_SHOW:     { label: 'No Show',     icon: Ban,        color: 'text-red-400',    description: 'This booking was marked as a no-show.' },
  // SALES
  SALES_NEW_VEHICLE_ENQUIRY: { label: 'Received',  icon: Clock,      color: 'text-blue-400',   description: 'We have received your enquiry and will be in touch shortly.' },
  SALES_CONTACTED:           { label: 'Contacted',  icon: PhoneCall,  color: 'text-yellow-400', description: 'We have reached out to you. Please check your phone or email.' },
  SALES_VIEWING_BOOKED:      { label: 'Viewing Booked', icon: CheckCircle, color: 'text-purple-400', description: 'Your viewing / test drive is booked.' },
  SALES_DEPOSIT_TAKEN:       { label: 'Deposit Taken', icon: CheckCircle, color: 'text-amber-400', description: 'Deposit received. Your vehicle is reserved.' },
  SALES_DEAL_AGREED:         { label: 'Deal Agreed', icon: CheckCircle, color: 'text-orange-400', description: 'Deal agreed. We are preparing your vehicle.' },
  SALES_SOLD:                { label: 'Sold',        icon: Truck,      color: 'text-green-400',  description: 'Congratulations! Your vehicle is ready for collection.' },
  SALES_LEFT_REVIEW:         { label: 'Complete',    icon: Star,       color: 'text-emerald-400', description: 'Thank you for your business!' },
  SALES_LOST:                { label: 'Closed',       icon: XCircle,    color: 'text-zinc-500',   description: 'This enquiry has been closed.' },
}

const FALLBACK = { label: 'Booked', icon: CheckCircle, color: 'text-purple-400', description: 'Your appointment is confirmed. We look forward to seeing you.' }

export default async function PortalPage({
  params,
}: {
  params: Promise<{ publicId: string }>
}) {
  const { publicId } = await params

  const lead = await prisma.lead.findUnique({
    where: { publicId },
    select: {
      name: true,
      stageKey: true,
      type: true,
      vrm: true,
      service: true,
      createdAt: true,
    },
  })

  if (!lead) notFound()

  const config = STATUS_CONFIG[lead.stageKey] || FALLBACK
  const Icon = config.icon

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-black tracking-tighter mb-1">
          Car Nation <span className="text-brand">Services</span>
        </h1>
        <p className="text-zinc-500 text-sm mb-8">Job Status Tracker</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-zinc-800 ${config.color} mb-4`}>
            <Icon className="h-7 w-7" />
          </div>

          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Current Status</p>
          <p className={`text-2xl font-black ${config.color}`}>{config.label}</p>
          <p className="text-sm text-zinc-400 mt-2 mb-6">{config.description}</p>

          <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-zinc-500">Name</span>
              <span>{lead.name}</span>
            </div>
            {lead.vrm && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Registration</span>
                <span className="font-mono font-bold">{lead.vrm}</span>
              </div>
            )}
            {lead.service && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Service</span>
                <span>{lead.service}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500">Submitted</span>
              <span>{new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-600 mt-6">
          Questions? Call us or reply to your confirmation email.
        </p>
      </div>
    </div>
  )
}
