import { ChevronDown } from 'lucide-react'
import './Chevron.css'

/** Arrow that turns when its section opens. Its hover square follows the enclosing button. */
export function Chevron({ open }: { open: boolean }) {
  return (
    <span className="chev" data-open={open} aria-hidden="true">
      <ChevronDown size={20} />
    </span>
  )
}
