import { useState } from 'react'
import { FileDown, Info, Layers, Plus, Sparkles, Trash2 } from 'lucide-react'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Breakdown } from './components/Breakdown'
import { PartEditor } from './components/PartEditor'
import { Logo } from './components/Logo'
import { QuoteSheet } from './components/QuoteSheet'
import { SendPanel } from './components/SendPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { Skeleton } from './components/Skeleton'
import { StepRail } from './components/StepRail'
import { TotalPanel } from './components/TotalPanel'
import { RateContext } from './context/rate'
import { useBcvRate } from './hooks/useBcvRate'
import { useQuote } from './hooks/useQuote'
import { useTotalDelta } from './hooks/useTotalDelta'
import { useTwoStepConfirm } from './hooks/useTwoStepConfirm'
import { MAX_PARTS, emptyForm, emptyPart, exampleForm } from './lib/defaults'
import { formatBs, formatRef } from './lib/format'
import { scrollToId } from './lib/scroll'
import { EMPTY_LINE, computeQuote } from './lib/pricing'
import type { QuoteForm } from './lib/types'
import './App.css'

const today = new Date().toLocaleDateString('es-VE')

export default function App() {
  const form = useForm<QuoteForm>({ defaultValues: emptyForm(), mode: 'onChange' })
  const { control, reset } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'parts' })
  const values = useWatch({ control }) as QuoteForm
  const quote = useQuote(values)
  const { state: rate, refreshing, refresh } = useBcvRate()
  const [delta, resetDelta] = useTotalDelta(quote.total)
  const [exampleLoaded, setExampleLoaded] = useState(false)
  const isExample = exampleLoaded && !form.formState.isDirty

  const loadExample = () => {
    const example = exampleForm()
    reset(example)
    resetDelta(computeQuote(example.parts, example.settings).total)
    setExampleLoaded(true)
  }
  const clear = useTwoStepConfirm(() => {
    reset(emptyForm())
    resetDelta(0)
    setExampleLoaded(false)
  })

  return (
    <RateContext.Provider value={rate}>
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
                {clear.armed ? 'Confirmar: vaciar todo' : 'Vaciar todo'}
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
                  <span>Datos de ejemplo inventados. Edítalos con los tuyos o pulsa «Vaciar todo».</span>
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
                  <button type="button" className="btn primary" onClick={() => window.print()} disabled={quote.total === 0}>
                    <FileDown size={20} aria-hidden="true" />
                    Guardar como PDF
                  </button>
                </div>
              </div>

              <Breakdown parts={values.parts} quote={quote} settings={values.settings} />

              <div className="sendwrap">
                <SendPanel quote={quote} />
              </div>
            </aside>
          </main>

          <button type="button" className="minibar" onClick={() => scrollToId('resumen')} aria-label="Ir al resumen del presupuesto">
            <span>Total</span>
            <strong className="num">{rate.status === 'loading' ? <Skeleton width={9} className="on-dark" /> : rate.status === 'ready' ? formatBs(quote.total, rate.rate) : formatRef(quote.total)}</strong>
          </button>
        </form>
      </FormProvider>
    </RateContext.Provider>
  )
}
