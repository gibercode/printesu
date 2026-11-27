import type { ReactNode } from 'react'
import './Collapse.css'

type Props = { open: boolean; id?: string; children: ReactNode }

/** Opens and closes by animating the row height; inert keeps the folded content out of the tab order. */
export function Collapse({ open, id, children }: Props) {
  return (
    <div className="collapse" id={id} data-open={open} inert={!open}>
      <div className="collapse-in">{children}</div>
    </div>
  )
}
