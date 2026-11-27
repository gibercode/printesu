import { useEffect, useState } from 'react'
import { FileDown, Info, Layers, Plus, Sparkles, Trash2 } from 'lucide-react'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Breakdown, Logo, PartEditor, QuoteSheet, SendPanel, SettingsPanel, Skeleton, StepRail, TotalPanel } from './components'
import { useQuote } from './hooks/useQuote'
import { useTotalDelta } from './hooks/useTotalDelta'
import { useAttemptStore } from './store/attempt'
import { useRate, useRateStore } from './store/rate'
import { sanitizeSettings, useSettingsStore } from './store/settings'
import { useTwoStepConfirm } from './hooks/useTwoStepConfirm'
import { MAX_PARTS, emptyForm, emptyPart, exampleForm } from './lib/defaults'
import { formatBs, formatRef } from './lib/format'
import { scrollToId } from './lib/scroll'
import { EMPTY_LINE, computeQuote } from './lib/pricing'
import type { QuoteForm } from './lib/types'
import './App.css'

const today = new Date().toLocaleDateString('es-VE')

export default function App() {
  const settings = useSettingsStore((s) => s.settings)
  const setSettings = useSettingsStore((s) => s.setSettings)
  const form = useForm<QuoteForm>({
    defaultValues: { ...emptyForm(), settings: useSettingsStore.getState().settings },
    mode: 'all',
  })
  const { control, reset } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'parts' })
  const values = useWatch({ control }) as QuoteForm

  // Form edits to the workshop settings are saved through the store (localStorage).
  const formSettings = useWatch({ control, name: 'settings' })
  useEffect(() => {
    setSettings(sanitizeSettings(formSettings))
  }, [formSettings, setSettings])

  const quote = useQuote({ parts: values.parts, settings })
  const setAttempted = useAttemptStore((s) => s.setAttempted)
  // Ids of the pieces folded away; a piece is open unless it is listed here.
  const [closed, setClosed] = useState<ReadonlySet<string>>(new Set())
  const togglePart = (pid: string) =>
    setClosed((prev) => {
      const next = new Set(prev)
      if (!next.delete(pid)) next.add(pid)
      return next
    })
  const partsOk = quote.lines.every((l) => l.missing.length === 0)
  const canExport = quote.total > 0 && partsOk
  // A blocked export shows what is missing on the fields themselves and jumps to the first one.
  const showMissing = async () => {
    setAttempted(true)
    // A folded piece with missing data opens so its fields can show what is missing.
    setClosed((prev) => new Set([...prev].filter((pid) => !fields.some((f, i) => f.id === pid && (quote.lines[i]?.missing.length ?? 0) > 0))))
    await form.trigger('parts')
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.step [aria-invalid="true"]')?.focus())
  }
  const rate = useRate()
  const refreshing = useRateStore((s) => s.refreshing)
  const refresh = useRateStore((s) => s.load)
  useEffect(() => {
    refresh()
  }, [refresh])
  const [delta, resetDelta] = useTotalDelta(quote.total)
  const [exampleLoaded, setExampleLoaded] = useState(false)
  const isExample = exampleLoaded && !form.formState.isDirty

  const loadExample = () => {
    const example = { ...exampleForm(), settings }
    reset(example)
    setAttempted(false)
    resetDelta(computeQuote(example.parts, settings).total)
    setExampleLoaded(true)
  }
  const clear = useTwoStepConfirm(() => {
    reset({ ...emptyForm(), settings })
    setAttempted(false)
    resetDelta(0)
    setExampleLoaded(false)
  })

  return (
    <FormProvider {...form}>
      <form className="sheet" onSubmit={(e) => e.preventDefault()} noValidate>
        <header className="masthead">
          <div>
            <h1 className="brand">
              <Logo />
            </h1>
            <p className="muted tagline">Presupuesto de impresión 3D con tus propios costes.</p>
          </div>
          <div className="tools" role="group" aria-label="Herramientas">
            <button type="button" className="btn ghost" onClick={loadExample}>
              <Sparkles size={18} aria-hidden="true" />
              Cargar ejemplo
            </button>
            <button
              type="button"
              className={`btn ghost${clear.armed ? ' confirm' : ''}`}
              onClick={clear.trigger}
              onBlur={clear.cancel}
            >
              <Trash2 size={18} aria-hidden="true" />
              {/* Both labels share one grid cell so the button keeps its width when it asks to confirm. */}
              <span className="swap">
                <span aria-hidden={clear.armed}>Vaciar piezas</span>
                <span aria-hidden={!clear.armed}>Confirmar</span>
              </span>
            </button>
          </div>
        </header>

        <QuoteSheet parts={values.parts} quote={quote} requester={values.requester} date={today} />

        <main className="layout">
          <div className="col-edit">
            <h2 className="sec">
              <Layers size={24} aria-hidden="true" />
              Piezas
            </h2>
            <StepRail ids={fields.map((f) => f.id)} parts={values.parts} quote={quote} />
            {isExample && (
              <p className="example-note" role="note">
                <Info size={18} aria-hidden="true" />
                <span>Datos de ejemplo inventados. Edítalos con los tuyos o pulsa «Vaciar piezas».</span>
              </p>
            )}
            {quote.total === 0 && (
              <p className="teach">
                Rellena peso, precio del material y tiempo de cada pieza, y tus costes en Ajustes. El total se
                reconstruye al instante. ¿Quieres verlo funcionando? Pulsa «Cargar ejemplo» (datos inventados).
              </p>
            )}
            {fields.map((f, i) => (
              <PartEditor
                key={f.id}
                id={f.id}
                index={i}
                line={quote.lines[i] ?? EMPTY_LINE}
                canRemove={fields.length > 1}
                open={!closed.has(f.id)}
                onToggle={() => togglePart(f.id)}
                onRemove={() => remove(i)}
              />
            ))}
            <button
              type="button"
              className="btn add"
              onClick={() => append(emptyPart())}
              disabled={fields.length >= MAX_PARTS}
            >
              <Plus size={20} aria-hidden="true" />
              {fields.length >= MAX_PARTS ? `Máximo ${MAX_PARTS} piezas` : 'Añadir pieza'}
            </button>

            <div className="settings-gap" />
            <SettingsPanel />
          </div>

          <aside className="col-result" id="resumen" aria-label="Resumen del presupuesto">
            <div className="pin">
              <TotalPanel total={quote.total} delta={delta} partCount={fields.length} refreshing={refreshing} onRefreshRate={refresh} />
              <div className="outputs">
                <button
                  type="button"
                  className="btn primary"
                  aria-disabled={!canExport}
                  onClick={() => (canExport ? window.print() : void showMissing())}
                >
                  <FileDown size={20} aria-hidden="true" />
                  Guardar como PDF
                </button>
              </div>
            </div>

            <Breakdown parts={values.parts} quote={quote} settings={settings} />

            <div className="sendwrap">
              <SendPanel quote={quote} namesOk={partsOk} />
            </div>
          </aside>
        </main>

        <footer className="credit">
          Desarrollado por{' '}
          <a href="https://github.com/gibercode" target="_blank" rel="noopener noreferrer">
            gibercode
          </a>
        </footer>

        <button type="button" className="minibar" onClick={() => scrollToId('resumen')} aria-label="Ir al resumen del presupuesto">
          <span>Total</span>
          <strong className="num">{rate.status === 'loading' ? <Skeleton width={9} className="on-dark" /> : rate.status === 'ready' ? formatBs(quote.total, rate.rate) : formatRef(quote.total)}</strong>
        </button>
      </form>
    </FormProvider>
  )
}
