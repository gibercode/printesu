import { Timer, Trash2, TriangleAlert } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { Chevron } from '../Chevron'
import { Collapse } from '../Collapse'
import { CheckboxField, Field, SelectField } from '../Field'
import { Money } from '../Money'
import { PartDrawing } from '../PartDrawing'
import { LAYERS, MATERIALS } from '../../lib/defaults'
import { formatHours, formatUsd } from '../../lib/format'
import { machineRate } from '../../lib/pricing'
import { useSettingsStore } from '../../store/settings'
import type { LineCost } from '../../lib/pricing'
import type { QuoteForm } from '../../lib/types'
import './PartEditor.css'

type PartField = Exclude<keyof QuoteForm['parts'][number], 'multicolor'>

type Props = {
  id: string
  index: number
  line: LineCost
  canRemove: boolean
  open: boolean
  onToggle: () => void
  onRemove: () => void
}

export function PartEditor({ id, index, line, canRemove, open, onToggle, onRemove }: Props) {
  const part = useWatch<QuoteForm, `parts.${number}`>({ name: `parts.${index}` })
  const settings = useSettingsStore((s) => s.settings)
  const autoRate = machineRate(settings, part?.printerId)
  const printerOptions = [
    { value: '', label: settings.printerName.trim() || 'Principal' },
    ...settings.printers.map((p, i) => ({ value: p.uid, label: p.name.trim() || `Impresora ${i + 2}` })),
  ]
  const path = (field: PartField) => `parts.${index}.${field}` as `parts.${number}.${PartField}`

  return (
    <section className="step" id={id} aria-labelledby={`${id}-t`} data-open={open}>
      <header className="step-head">
        <button
          type="button"
          className="step-handle"
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={onToggle}
        >
          <span className="step-n" aria-hidden="true">
            {index + 1}
          </span>
          <span className="step-title">
            <strong id={`${id}-t`} data-empty={!part?.name?.trim() || undefined}>
              {part?.name?.trim() || 'Pieza sin nombre'}
            </strong>
            {line.missing.length > 0 ? (
              <span className="warn">
                <TriangleAlert size={14} aria-hidden="true" />
                Faltan datos
              </span>
            ) : (
              <span className="muted">
                ×{line.qty} · {Math.round(line.grams * 10) / 10} g · {formatHours(line.hours)}
              </span>
            )}
          </span>
          <span className="step-price">
            <Money usd={line.final} />
          </span>
          <Chevron open={open} />
        </button>
      </header>

      <Collapse open={open} id={`${id}-body`}>
        <div className="step-content">
            <div className="step-name">
              <Field name={path('name')} label="Nombre de la pieza" numeric={false} required="Escribe un nombre para la pieza." />
            </div>
      <div className="step-body">
        <figure className="step-fig">
          <PartDrawing
            layer={part?.layer ?? '0.20'}
            infill={part?.infill ?? ''}
            multicolor={!!part?.multicolor}
            hours={part?.hours ?? ''}
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

          <Field name={path('modelG')} label="Peso del modelo" unit="g" placeholder="0" required="Escribe el peso." />
          <Field name={path('supportG')} label="Soportes" unit="g" placeholder="0" />
          <Field name={path('pricePerKg')} label="Precio del material" unit="$/kg" placeholder="0" required="Escribe el precio." />
          <CheckboxField className="wide" name={`parts.${index}.multicolor`} label="Multicolor" />

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

          {settings.printers.length > 0 && (
            <SelectField name={path('printerId')} label="Impresora" options={printerOptions} />
          )}
          <Field
            name={path('hours')}
            label="Tiempo de impresión"
            unit="h"
            kind="hours"
            required="Escribe el tiempo."
            placeholder="3:30"
            hint="Como lo da tu slicer: 3,5 · 3:30 · 3h 30m."
          />
          {line.qty > 1 && (
            <Field
              name={path('perPlate')}
              label="Piezas por plancha"
              unit="uds"
              placeholder="1"
              hint="Si caben varias juntas, las horas son de toda la plancha."
            />
          )}
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
              {line.runs > 1 && line.runs < line.qty ? ` · ${line.runs} tiradas` : ''}
            </span>
          )}
        </p>
        <button type="button" className="btn ghost" onClick={onRemove} disabled={!canRemove}>
          <Trash2 size={18} aria-hidden="true" />
          Quitar pieza
        </button>
      </footer>
        </div>
      </Collapse>
    </section>
  )
}
