import { useState, useEffect, useMemo } from 'react'

type Cycle = 'mensual' | 'anual'
type Currency = 'ARS' | 'USD'
type Tab = 'resumen' | 'categorias'

interface Sub {
  id: string
  name: string
  amount: number
  currency: Currency
  cycle: Cycle
  nextDate: string
  category: string
}

const CATEGORIES = ['Streaming', 'Musica', 'Software', 'IA', 'Gym', 'Otros']

const fmt = (n: number, c: Currency) =>
  (c === 'USD' ? 'US$' : '$') +
  n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

const monthly = (s: Sub) => (s.cycle === 'anual' ? s.amount / 12 : s.amount)

const daysUntil = (iso: string) => {
  if (!iso) return Infinity
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.round((new Date(iso + 'T00:00:00').getTime() - today.getTime()) / 86400000)
}
const ledClass = (days: number) => (days <= 3 ? 'led-red' : days <= 7 ? 'led-amber' : 'led-blue')
const whenLabel = (days: number) => {
  if (days === Infinity) return 'sin fecha'
  if (days < 0) return 'vencida'
  if (days === 0) return 'hoy'
  if (days === 1) return 'manana'
  return `en ${days}d`
}

export default function App() {
  const [tab, setTab] = useState<Tab>('resumen')
  const [subs, setSubs] = useState<Sub[]>([])
  const [open, setOpen] = useState(false)

  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>('ARS')
  const [cycle, setCycle] = useState<Cycle>('mensual')
  const [nextDate, setNextDate] = useState('')
  const [category, setCategory] = useState('Streaming')

  useEffect(() => {
    const saved = localStorage.getItem('dot-subs')
    if (saved) setSubs(JSON.parse(saved))
  }, [])

  const persist = (next: Sub[]) => { setSubs(next); localStorage.setItem('dot-subs', JSON.stringify(next)) }
  const reset = () => { setName(''); setAmount(''); setCurrency('ARS'); setCycle('mensual'); setNextDate(''); setCategory('Streaming') }

  const add = () => {
    const amt = parseFloat(amount)
    if (!name.trim() || !amt || amt <= 0) return
    persist([{ id: crypto.randomUUID(), name: name.trim(), amount: amt, currency, cycle, nextDate, category }, ...subs])
    reset(); setOpen(false)
  }
  const remove = (id: string) => persist(subs.filter((s) => s.id !== id))

  const monthlyARS = subs.filter((s) => s.currency === 'ARS').reduce((a, s) => a + monthly(s), 0)
  const monthlyUSD = subs.filter((s) => s.currency === 'USD').reduce((a, s) => a + monthly(s), 0)
  const sorted = [...subs].sort((a, b) => daysUntil(a.nextDate) - daysUntil(b.nextDate))
  const upcoming = sorted.find((s) => daysUntil(s.nextDate) >= 0 && s.nextDate)
  const canSave = name.trim().length > 0 && parseFloat(amount) > 0

  const byCategory = useMemo(() => {
    const map = new Map<string, { count: number; ars: number; usd: number }>()
    for (const s of subs) {
      const e = map.get(s.category) || { count: 0, ars: 0, usd: 0 }
      e.count++
      if (s.currency === 'ARS') e.ars += monthly(s); else e.usd += monthly(s)
      map.set(s.category, e)
    }
    const arr = Array.from(map.entries()).map(([cat, v]) => ({ cat, ...v }))
    arr.sort((a, b) => b.ars - a.ars)
    const maxArs = Math.max(1, ...arr.map((a) => a.ars))
    return { arr, maxArs }
  }, [subs])

  return (
    <div className="app">
      <div className="wrap">
        <header className="head">
          <div className="brand">
            <h1>Subs <span className="accent">by dot</span></h1>
            <p>{tab === 'resumen' ? 'Cuanto gastas en suscripciones' : 'Gasto por categoria'}</p>
          </div>
          <span className="sig">dot<span className="dot">&bull;</span></span>
        </header>

        {tab === 'resumen' && (
          <>
            <div className="summary">
              <div className="stat">
                <div className="k">Por mes</div>
                <div className="v blue">{fmt(monthlyARS, 'ARS')}</div>
                {monthlyUSD > 0 && <div className="u">+ {fmt(monthlyUSD, 'USD')} /mes</div>}
              </div>
              <div className="stat">
                <div className="k">Por ano</div>
                <div className="v">{fmt(monthlyARS * 12, 'ARS')}</div>
                {monthlyUSD > 0 && <div className="u">+ {fmt(monthlyUSD * 12, 'USD')} /ano</div>}
              </div>
            </div>

            {upcoming && (
              <div className="next">
                <div><div className="lbl">Proximo cobro</div><div className="nm">{upcoming.name}</div></div>
                <div className="when"><div className="d">{whenLabel(daysUntil(upcoming.nextDate))}</div><div className="s">{fmt(upcoming.amount, upcoming.currency)} &middot; {upcoming.cycle}</div></div>
              </div>
            )}

            <div className="sec-title"><h2>Mis suscripciones</h2><span className="count">{subs.length}</span></div>

            {subs.length === 0 ? (
              <div className="empty"><div className="big">&#128183;</div>Todavia no cargaste ninguna.<br />Toca <b>Agregar</b> para empezar.</div>
            ) : sorted.map((s) => {
              const d = daysUntil(s.nextDate)
              return (
                <div className="sub-row" key={s.id}>
                  <span className={`dot-led ${ledClass(d)}`} />
                  <div className="sub-main">
                    <div className="nm">{s.name} <span className="tag">{s.category}</span></div>
                    <div className="meta">{s.nextDate ? whenLabel(d) : 'sin fecha'} &middot; {s.cycle}</div>
                  </div>
                  <div className="sub-amt"><div className="a">{fmt(s.amount, s.currency)}</div><div className="per">{fmt(monthly(s), s.currency)}/mes</div></div>
                  <button className="del" onClick={() => remove(s.id)} aria-label="Eliminar">&times;</button>
                </div>
              )
            })}
            <footer className="foot">Hecho por dot<span className="dot">&bull;</span> &middot; @dot.sfco</footer>
          </>
        )}

        {tab === 'categorias' && (
          <>
            {subs.length === 0 ? (
              <div className="empty"><div className="big">&#128202;</div>Sin datos todavia.<br />Carga suscripciones para ver el desglose.</div>
            ) : byCategory.arr.map((c) => (
              <div className="cat-row" key={c.cat} style={{ display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="cn">{c.cat}</span>
                  <span className="cc">{c.count} sub(s)</span>
                  <span className="cv" style={{ marginLeft: 'auto' }}>{fmt(c.ars, 'ARS')}/mes{c.usd > 0 ? ` + ${fmt(c.usd, 'USD')}` : ''}</span>
                </div>
                <div className="cat-bar"><i style={{ width: `${Math.round(c.ars / byCategory.maxArs * 100)}%` }} /></div>
              </div>
            ))}
            <footer className="foot">Hecho por dot<span className="dot">&bull;</span> &middot; @dot.sfco</footer>
          </>
        )}
      </div>

      <button className="fab" onClick={() => setOpen(true)}><span className="plus">+</span> Agregar</button>

      <nav className="bottomnav">
        <button className={tab === 'resumen' ? 'on' : ''} onClick={() => setTab('resumen')}>
          <span className="bn-ico">&#128181;</span><span className="bn-tx">Resumen</span></button>
        <button className={tab === 'categorias' ? 'on' : ''} onClick={() => setTab('categorias')}>
          <span className="bn-ico">&#128202;</span><span className="bn-tx">Categorias</span></button>
      </nav>

      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grip" />
            <h3>Nueva <span className="accent">suscripcion</span></h3>
            <div className="f">
              <label>Nombre</label>
              <input className="inp" value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix, Spotify, ChatGPT..." />
            </div>
            <div className="row2">
              <div className="f"><label>Monto</label>
                <input className="inp" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" /></div>
              <div className="f" style={{ maxWidth: 130 }}><label>Moneda</label>
                <div className="seg">
                  <button className={currency === 'ARS' ? 'on' : ''} onClick={() => setCurrency('ARS')}>ARS</button>
                  <button className={currency === 'USD' ? 'on' : ''} onClick={() => setCurrency('USD')}>USD</button>
                </div></div>
            </div>
            <div className="f"><label>Ciclo</label>
              <div className="seg">
                <button className={cycle === 'mensual' ? 'on' : ''} onClick={() => setCycle('mensual')}>Mensual</button>
                <button className={cycle === 'anual' ? 'on' : ''} onClick={() => setCycle('anual')}>Anual</button>
              </div></div>
            <div className="f"><label>Proximo cobro</label>
              <input className="inp" type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} /></div>
            <div className="f"><label>Categoria</label>
              <div className="cats-wrap">{CATEGORIES.map((c) => (
                <button key={c} className={`catb${category === c ? ' on' : ''}`} onClick={() => setCategory(c)}>{c}</button>))}</div></div>
            <div className="sheet-actions">
              <button className="btn btn-primary" onClick={add} disabled={!canSave}>Guardar</button>
              <button className="btn btn-ghost" onClick={() => { reset(); setOpen(false) }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
