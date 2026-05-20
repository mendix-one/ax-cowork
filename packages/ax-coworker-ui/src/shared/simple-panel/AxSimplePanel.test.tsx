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

  it('invokes onHide when Hide menu item is clicked', async () => {
    const user = userEvent.setup()
    const onHide = vi.fn()
    render(<AxSimplePanel icon="mdiFolderOutline" title="Tasks" onHide={onHide} />)

    // Click the kebab button (dots-vertical) — last button in header
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[buttons.length - 1])

    // Dropdown opens in portal; find Hide item by text
    const hideItem = await screen.findByText('Hide')
    await user.click(hideItem)

    expect(onHide).toHaveBeenCalledTimes(1)
  })
})
