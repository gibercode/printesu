import { Plus, RotateCcw, Trash2, Wrench } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Field } from './Field'
import { DEFAULT_PRINTER_COST, MAX_EXTRA_PRINTERS, PRINTER_PRESETS, emptyPrinter, emptySettings } from '../lib/defaults'
import { formatUsd } from '../lib/format'
import { machineRate } from '../lib/pricing'
import { useSettingsStore } from '../store/settings'
import type { QuoteForm } from '../lib/types'

const CUSTOM = 'custom'

export function SettingsPanel() {
  const { control, setValue, clearErrors } = useFormContext<QuoteForm>()
  const extras = useFieldArray({ control, name: 'settings.printers' })
  const settings = useSettingsStore((s) => s.settings)
  const resetSettings = useSettingsStore((s) => s.reset)
  const rate = machineRate(settings)
  const preset = PRINTER_PRESETS.find((p) => p.cost === settings.printerCost.trim())

  return (
    <details className="settings">
      <summary>
        <Wrench size={20} aria-hidden="true" />
        Ajustes del taller (opcionales)
      </summary>
      <p className="muted lead">
        Si los dejas vacíos se usan valores típicos y el costo de máquina por hora sale solo. Rellénalos si tu impresora es
        distinta. Se guardan en este navegador.
      </p>
      {extras.fields.length > 0 && <h3 className="printer-title">Impresora principal</h3>}
      <div className="grid-fields">
        {extras.fields.length > 0 && (
          <Field name="settings.printerName" label="Nombre" numeric={false} placeholder="Principal" />
        )}
        <div className="field">
          <label htmlFor="printer-preset">Tipo de impresora</label>
          <div className="cell">
            <select
              id="printer-preset"
              value={preset ? preset.cost : settings.printerCost.trim() === "" ? "" : CUSTOM}
              onChange={(e) => {
                if (e.target.value !== CUSTOM) setValue('settings.printerCost', e.target.value, { shouldDirty: true })
              }}
            >
              <option value="">Sin elegir</option>
              {PRINTER_PRESETS.map((p) => (
                <option key={p.cost} value={p.cost}>
                  {p.label}
                </option>
              ))}
              <option value={CUSTOM}>Personalizada</option>
            </select>
          </div>
        </div>
        <Field name="settings.printerCost" label="Coste de la impresora" unit="$" placeholder={DEFAULT_PRINTER_COST} />
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
      {extras.fields.map((f, i) => {
        const base = `settings.printers.${i}` as const
        const extraRate = machineRate(settings, f.uid)
        return (
          <fieldset className="printer-block" key={f.id}>
            <legend>{settings.printers[i]?.name.trim() || `Impresora ${i + 2}`}</legend>
            <div className="grid-fields">
              <Field name={`${base}.name`} label="Nombre" numeric={false} placeholder={`Impresora ${i + 2}`} />
              <Field name={`${base}.printerCost`} label="Coste de la impresora" unit="$" placeholder={DEFAULT_PRINTER_COST} />
              <Field name={`${base}.lifeHours`} label="Vida útil estimada" unit="h" placeholder="3000" />
              <Field name={`${base}.maintPerHour`} label="Mantenimiento" unit="$/h" placeholder="automático" />
            </div>
            <div className="printer-foot">
              <p className="machine-rate" role="status">
                Costo de máquina: <strong className="num">{formatUsd(extraRate)}</strong>/h
              </p>
              <button type="button" className="btn ghost" onClick={() => extras.remove(i)}>
                <Trash2 size={18} aria-hidden="true" />
                Quitar impresora
              </button>
            </div>
          </fieldset>
        )
      })}
      {extras.fields.length > 0 && (
        <p className="muted lead">Elige cuál usa cada pieza en su campo «Impresora», junto al tiempo de impresión.</p>
      )}
      <div className="settings-actions">
        <button
          type="button"
          className="btn ghost"
          disabled={extras.fields.length >= MAX_EXTRA_PRINTERS}
          onClick={() => extras.append(emptyPrinter())}
        >
          <Plus size={18} aria-hidden="true" />
          Añadir otra impresora
        </button>
      <button
        type="button"
        className="btn ghost reset-settings"
        onClick={() => {
          resetSettings()
          setValue('settings', emptySettings(), { shouldDirty: true })
          extras.replace([])
          clearErrors('settings')
        }}
      >
        <RotateCcw size={18} aria-hidden="true" />
        Restablecer valores
      </button>
      </div>
    </details>
  )
}
