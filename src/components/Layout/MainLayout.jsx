import Sidebar from '../Sidebar/Sidebar'

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
        <main className="ml-64 flex-1 overflow-y-auto p-lg">
            {children}
        </main>
    </div>
  )
}