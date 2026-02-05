import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header (sau nay co the them) */}
      <main className="p-3">{children}</main>
    </div>
  )
}
