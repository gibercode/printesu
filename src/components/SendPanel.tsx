import { Minus, MessageCircle, Plus, Send } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Field } from './Field'
import { useRate } from '../context/rate'
import type { Quote } from '../lib/pricing'
import { buildSummary } from '../lib/summary'
import type { QuoteForm } from '../lib/types'

export function SendPanel({ quote }: { quote: Quote }) {
  const { getValues, watch } = useFormContext<QuoteForm>()
  const rate = useRate()
  const [opened, setOpened] = useState(false)
  const digits = (watch('requester.to') ?? '').replace(/\D/g, '')
  const hasQuote = quote.total > 0

  const open = () => {
    const { parts, requester } = getValues()
    const text = buildSummary(parts, quote, rate, requester)
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    setOpened(true)
  }

  return (
    <details className="send">
      <summary>
        <Send size={20} aria-hidden="true" />
        Enviar al cliente
        <Plus className="sum-open" size={20} aria-hidden="true" />
        <Minus className="sum-close" size={20} aria-hidden="true" />
      </summary>
      <div className="grid-fields one">
        <Field name="requester.name" label="Nombre del cliente" numeric={false} />
        <Field
          name="requester.to"
          label="WhatsApp del cliente"
          numeric={false}
          placeholder="58412XXXXXXX"
          hint="Número con prefijo de país, sin + ni espacios."
        />
        <Field name="requester.notes" label="Nota para el cliente" numeric={false} hint="Aparece en el mensaje y en el PDF." />
      </div>
      <div className="actions">
        <button type="button" className="btn" disabled={!hasQuote || digits.length < 6} onClick={open}>
          <MessageCircle size={20} aria-hidden="true" />
          Enviar por WhatsApp
        </button>
      </div>
      <p className="hint" role="status">
        {!hasQuote
          ? 'Completa al menos una pieza para preparar el mensaje.'
          : opened
            ? 'Se abrió WhatsApp con el presupuesto. Pulsa enviar allí para terminar.'
            : 'El mensaje solo incluye piezas, cantidades y precios. El envío lo confirmas tú.'}
      </p>
    </details>
  )
}
