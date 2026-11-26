import { Minus, Plus, Wrench } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Field } from './Field'
import { PRINTER_PRESETS } from '../lib/defaults'
import { formatUsd } from '../lib/format'
import { machineRate } from '../lib/pricing'
import type { QuoteForm } from '../lib/types'

const CUSTOM = 'custom'

export function SettingsPanel() {
  const { control, setValue } = useFormContext<QuoteForm>()
  const settings = useWatch({ control, name: 'settings' })
  const rate = machineRate(settings)
  const preset = PRINTER_PRESETS.find((p) => p.cost === settings.printerCost.trim())

  return (
    <details className="settings">
      <summary>
        <Wrench size={20} aria-hidden="true" />
        Ajustes del taller (opcionales)
        <Plus className="sum-open" size={20} aria-hidden="true" />
        <Minus className="sum-close" size={20} aria-hidden="true" />
      </summary>
      <p className="muted lead">
        Ya vienen con valores típicos, así que el costo de máquina por hora sale solo. Cámbialos si tu impresora es
        distinta. No se guardan al cerrar la página.
      </p>
      <div className="grid-fields">
        <div className="field">
          <label htmlFor="printer-preset">Tipo de impresora</label>
          <div className="cell">
            <select
              id="printer-preset"
              value={preset ? preset.cost : CUSTOM}
              onChange={(e) => {
                if (e.target.value !== CUSTOM) setValue('settings.printerCost', e.target.value, { shouldDirty: true })
              }}
            >
              {PRINTER_PRESETS.map((p) => (
                <option key={p.cost} value={p.cost}>
                  {p.label}
                </option>
              ))}
              <option value={CUSTOM}>Personalizada</option>
            </select>
          </div>
        </div>
        <Field name="settings.printerCost" label="Coste de la impresora" unit="$" placeholder="0" />
        <Field name="settings.lifeHours" label="Vida útil estimada" unit="h" placeholder="3000" hint="Entre 2.000 y 5.000 h según las guías." />
        <Field
          name="settings.maintPerHour"
          label="Mantenimiento"
          unit="$/h"
          placeholder="automático"
          hint="Vacío: 5 % del coste repartido en la vida útil."
        />
        <Field name="settings.failurePct" label="Margen para fallos" unit="%" placeholder="0" hint="Sobre el subtotal." />
        <Field name="settings.marginPct" label="Margen de ganancia" unit="%" placeholder="0" hint="Sobre subtotal y fallos." />
      </div>
      <p className="machine-rate" role="status">
        {rate > 0 ? (
          <>
            Costo de máquina automático: <strong className="num">{formatUsd(rate)}</strong>/h
          </>
        ) : (
          'Sin definir: cada pieza puede llevar su propio costo por hora.'
        )}
      </p>
    </details>
  )
}
