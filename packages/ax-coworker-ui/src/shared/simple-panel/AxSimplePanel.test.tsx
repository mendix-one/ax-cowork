import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxSimplePanel } from './AxSimplePanel'

describe('AxSimplePanel', () => {
  it('renders title and children', () => {
    render(
      <AxSimplePanel icon="mdiFolderOutline" title="Tasks">
        <p>panel body</p>
      </AxSimplePanel>,
    )
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('panel body')).toBeInTheDocument()
  })

  it('invokes onClose when Close menu item is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AxSimplePanel icon="mdiFolderOutline" title="Tasks" onClose={onClose} />)

    // Click the kebab button (dots-vertical) — last button in header
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[buttons.length - 1])

    // Dropdown opens in portal; find Close item by text
    const closeItem = await screen.findByText('Close')
    await user.click(closeItem)

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
