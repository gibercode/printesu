import { useId, useState, type ReactNode } from 'react'
import { Chevron } from '../Chevron'
import { Collapse } from '../Collapse'
import './Disclosure.css'

type Props = { icon: ReactNode; title: string; className?: string; children: ReactNode }

/** A grey panel whose title row opens and closes its content, closed by default. */
export function Disclosure({ icon, title, className, children }: Props) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()
  return (
    <section className={`disclosure${className ? ` ${className}` : ''}`}>
      <h2 className="disclosure-title">
        <button type="button" className="disclosure-handle" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((o) => !o)}>
          {icon}
          <span>{title}</span>
          <Chevron open={open} />
        </button>
      </h2>
      <Collapse open={open} id={bodyId}>
        <div className="disclosure-body">{children}</div>
      </Collapse>
    </section>
  )
}
