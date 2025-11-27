import type { ReactNode } from "react"

interface PageWrapperProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

export function PageWrapper({ title, description, children, actions }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>
        </div>
      </div> */}

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-3">{children}</main>
    </div>
  )
}
