import type { ReactElement } from 'react'

// Top-bar brand logo. Renders the configured image (Mendix `image` prop, resolved to a URI by
// AxAppSync and held in the store). Optionally clickable — fires the configured On-logo action
// through the store. Renders nothing when no logo is configured.
export function AxLogo({ logoUrl, alt = 'logo', onClick }: { logoUrl?: string; alt?: string; onClick?: () => void }): ReactElement | null {
  if (!logoUrl) return null
  return (
    <div
      className="ax-sim_logo"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? alt : undefined}
      onKeyDown={(e) => {
        if (onClick && e.key === 'Enter') onClick()
      }}
    >
      <img className="ax-sim_logo_image" src={logoUrl} alt={alt} />
    </div>
  )
}
