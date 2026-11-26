import { Timer, Trash2, TriangleAlert } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { CheckboxField, Field, SelectField } from './Field'
import { Money } from './Money'
import { PartDrawing } from './PartDrawing'
import { LAYERS, MATERIALS } from '../lib/defaults'
import { formatHours, formatUsd } from '../lib/format'
import { machineRate } from '../lib/pricing'
import type { LineCost } from '../lib/pricing'
import type { QuoteForm } from '../lib/types'

type PartField = Exclude<keyof QuoteForm['parts'][number], 'multicolor'>

type Props = {
  id: string
  index: number
  line: LineCost
  canRemove: boolean
  onRemove: () => void
}

export function PartEditor({ id, index, line, canRemove, onRemove }: Props) {
  const part = useWatch<QuoteForm, `parts.${number}`>({ name: `parts.${index}` })
  const settings = useWatch<QuoteForm, 'settings'>({ name: 'settings' })
  const autoRate = machineRate(settings)
  const path = (field: PartField) => `parts.${index}.${field}` as `parts.${number}.${PartField}`

  return (
    <section className="step" id={id} aria-labelledby={`${id}-t`}>
      <header className="step-head">
        <span className="step-n" aria-hidden="true">
          {index + 1}
        </span>
        <div className="step-name">
          <Field name={path('name')} label="Nombre de la pieza" numeric={false} placeholder={`Pieza ${index + 1}`} />
        </div>
        <div className="step-price">
          <span id={`${id}-t`} className="muted">
            Precio
          </span>
          <Money usd={line.final} />
        </div>
      </header>

      <div className="step-body">
        <figure className="step-fig">
          <PartDrawing
            layer={part?.layer ?? '0.20'}
            infill={part?.infill ?? ''}
            multicolor={!!part?.multicolor}
            hours={part?.hours ?? ''}
            minutes={part?.minutes ?? ''}
            qty={line.qty}
          />
          <figcaption>
            <span className="qty">×{line.qty}</span>
            <span className="muted">
              {part?.material} · {part?.layer} mm{part?.multicolor ? ' · color' : ''}
            </span>
          </figcaption>
        </figure>

        <div className="grid-fields">
          <SelectField name={path('material')} label="Material" options={MATERIALS} />
          <SelectField name={path('layer')} label="Altura de capa" options={LAYERS} unit="mm" />
          <Field name={path('infill')} label="Relleno" unit="%" placeholder="20" />
          <Field name={path('qty')} label="Cantidad" unit="uds" placeholder="1" />

          <Field name={path('modelG')} label="Peso del modelo" unit="g" placeholder="0" />
          <Field name={path('supportG')} label="Soportes" unit="g" placeholder="0" />
          <Field name={path('pricePerKg')} label="Precio del material" unit="$/kg" placeholder="0" />
          <CheckboxField name={`parts.${index}.multicolor`} label="Multicolor" />

          {part?.multicolor && (
            <Field
              className="wide"
              name={path('purgeG')}
              label="Purga y torre"
              unit="g"
              placeholder="0"
              hint="Los gramos de purga que indica tu slicer. Se cobran como material."
            />
          )}

          <Field name={path('hours')} label="Horas de impresión" unit="h" placeholder="0" />
          <Field name={path('minutes')} label="Minutos" unit="min" placeholder="0" />
          <Field
            name={path('hourRate')}
            label="Costo por hora"
            unit="$/h"
            placeholder={autoRate > 0 ? autoRate.toFixed(2).replace('.', ',') : '0'}
            hint={autoRate > 0 ? `Vacío: automático (${formatUsd(autoRate)}/h).` : 'Opcional.'}
          />
        </div>
      </div>

      <footer className="step-foot">
        <p className="part-foot" role="status">
          {line.missing.length > 0 ? (
            <span className="warn">
              <TriangleAlert size={16} aria-hidden="true" />
              Falta: {line.missing.join(', ')}.
            </span>
          ) : line.machineIdle ? (
            <span className="warn">
              <TriangleAlert size={16} aria-hidden="true" />
              Las horas aún no suman al precio: escribe el costo de máquina por hora de esta pieza.
            </span>
          ) : (
            <span className="muted note-icon">
              <Timer size={16} aria-hidden="true" />
              {Math.round(line.grams * 10) / 10} g · {formatHours(line.hours)} de máquina
            </span>
          )}
        </p>
        <button type="button" className="btn ghost" onClick={onRemove} disabled={!canRemove}>
          <Trash2 size={18} aria-hidden="true" />
          Quitar pieza
        </button>
      </footer>
    </section>
  )
}
