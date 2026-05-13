import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AxMuiIcon } from './AxMuiIcon'

describe('AxMuiIcon', () => {
  it('renders an SVG with the requested icon path', () => {
    const { container } = render(<AxMuiIcon icon="mdiAccountCircleOutline" size={20} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.getAttribute('width')).toBe('20px')
    expect(svg?.querySelector('path')?.getAttribute('d')).toBeTruthy()
  })

  it('applies className and color props', () => {
    const { container } = render(<AxMuiIcon icon="mdiBellOutline" className="my-icon" color="#ff0000" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('my-icon')
    expect(svg?.getAttribute('fill')).toBe('#ff0000')
  })

  it('defaults size to 24px when not provided', () => {
    const { container } = render(<AxMuiIcon icon="mdiHomeOutline" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('24px')
  })
})
