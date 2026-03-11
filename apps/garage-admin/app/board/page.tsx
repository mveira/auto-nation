import { KanbanBoard } from '@/components/KanbanBoard'

export default function BoardPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <h1 className="font-black text-lg tracking-tighter">
          Garage <span className="text-brand">Admin</span>
        </h1>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="text-xs text-zinc-500 hover:text-white transition-colors">
            Sign Out
          </button>
        </form>
      </header>
      <main className="px-6 py-4">
        <KanbanBoard />
      </main>
    </div>
  )
}
