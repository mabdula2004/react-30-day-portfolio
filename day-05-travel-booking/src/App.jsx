import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronDown, Compass, Heart, LoaderCircle, LogIn, MapPin, Menu, Minus, Plus, Search, Star, UserRound, Users, X } from 'lucide-react'
import { destinations as fallbackDestinations, journal } from './data/destinations.js'
import { isSupabaseConfigured, supabase } from './lib/supabase.js'

const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })
const mapJourney = row => ({ id: row.id, slug: row.slug, city: row.city, country: row.country, eyebrow: row.eyebrow, description: row.description, price: row.price_gbp, rating: Number(row.rating), reviews: row.review_count, nights: row.nights, vibe: row.vibe, image: row.image_url })

function Header({ savedCount, savedOnly, onSaved, session, onAccount }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Roamly home"><span>R</span>ROAMLY</a>
    <nav className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
      <a href="#stays" onClick={() => setOpen(false)}>Journeys</a>
      <a href="#why" onClick={() => setOpen(false)}>Our approach</a>
      <a href="#journal" onClick={() => setOpen(false)}>Journal</a>
      <button className={savedOnly ? 'saved-link active' : 'saved-link'} onClick={() => { onSaved(); setOpen(false) }}><Heart size={16}/> Saved <b>{savedCount}</b></button>
      <button className="account-link" onClick={() => { onAccount(); setOpen(false) }}>{session ? <UserRound size={16}/> : <LogIn size={16}/>} {session ? 'Account' : 'Sign in'}</button>
    </nav>
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
  </header>
}

function SearchBar({ search, setSearch, onSearch }) {
  return <form className="search-shell" onSubmit={e => { e.preventDefault(); onSearch() }}>
    <label><span>Where</span><div><MapPin size={17}/><input value={search.where} onChange={e => setSearch(s => ({ ...s, where: e.target.value }))} aria-label="Destination" placeholder="Anywhere inspiring"/></div></label>
    <label><span>When</span><div className="date-field"><CalendarDays size={17}/><input type="date" value={search.date} min={new Date().toISOString().slice(0, 10)} onChange={e => setSearch(s => ({ ...s, date: e.target.value }))} aria-label="Departure date"/></div></label>
    <label><span>Travellers</span><div className="guest-stepper"><Users size={17}/><button type="button" aria-label="Remove traveller" onClick={() => setSearch(s => ({ ...s, guests: Math.max(1, s.guests - 1) }))}><Minus size={14}/></button><b>{search.guests}</b><button type="button" aria-label="Add traveller" onClick={() => setSearch(s => ({ ...s, guests: Math.min(12, s.guests + 1) }))}><Plus size={14}/></button></div></label>
    <button className="search-cta" aria-label="Search journeys"><Search size={19}/><span>Explore</span></button>
  </form>
}

function Hero({ search, setSearch, onSearch }) {
  return <section className="hero" id="top">
    <div className="hero-image"/><div className="hero-shade"/>
    <div className="hero-copy"><p className="kicker light">Curated escapes · thoughtfully made</p><h1>Go somewhere<br/><em>worth remembering.</em></h1><p className="hero-sub">Distinctive stays, unhurried itineraries and local moments — brought together in one beautifully simple journey.</p></div>
    <div className="hero-note"><span>01</span><p>Made for the curious,<br/>not the crowds.</p></div>
    <SearchBar search={search} setSearch={setSearch} onSearch={onSearch}/>
  </section>
}

function DestinationCard({ trip, saved, onSave, onOpen }) {
  return <article className="trip-card">
    <button className={saved ? 'heart active' : 'heart'} onClick={() => onSave(trip)} aria-label={`${saved ? 'Remove' : 'Save'} ${trip.city}`}><Heart size={18} fill={saved ? 'currentColor' : 'none'}/></button>
    <button className="image-button" onClick={() => onOpen(trip)} aria-label={`View ${trip.city}`}><img src={trip.image} alt={`${trip.city}, ${trip.country}`}/><span className="vibe">{trip.vibe}</span></button>
    <div className="trip-body"><div className="trip-top"><div><p>{trip.eyebrow}</p><h3>{trip.city}</h3><span>{trip.country}</span></div><div className="rating"><Star size={14} fill="currentColor"/>{trip.rating}</div></div><div className="trip-meta"><span>{trip.nights} nights</span><span>from <strong>{money.format(trip.price)}</strong> pp</span></div></div>
  </article>
}

function TripModal({ trip, onClose, onBook }) {
  if (!trip) return null
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="trip-modal" role="dialog" aria-modal="true" aria-label={`${trip.city} journey details`}>
      <button className="modal-close" onClick={onClose} aria-label="Close journey details"><X/></button>
      <div className="modal-photo"><img src={trip.image} alt={`${trip.city}, ${trip.country}`}/><span>{trip.nights} nights · {trip.vibe}</span></div>
      <div className="modal-copy"><p className="kicker">{trip.country} · private departure</p><h2>{trip.city}</h2><p>{trip.description}</p><div className="modal-highlights"><span>Design-led stay</span><span>Local host</span><span>Flexible arrival</span></div><div className="modal-footer"><div><small>From, per traveller</small><strong>{money.format(trip.price)}</strong></div><button onClick={() => onBook(trip)}>Build this journey <ArrowRight size={17}/></button></div></div>
    </section>
  </div>
}

function AuthPanel({ open, onClose, session, onToast }) {
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (!open) return null
  const submit = async e => {
    e.preventDefault(); setError('')
    if (!isSupabaseConfigured) return setError('Live authentication will activate when the dedicated Roamly Supabase project is connected.')
    setBusy(true)
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name } } })
      : await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setBusy(false)
    if (result.error) return setError(result.error.message)
    onToast(mode === 'signup' ? 'Account created. Check your email if confirmation is enabled.' : 'Welcome back to Roamly.')
    onClose()
  }
  const signOut = async () => { await supabase?.auth.signOut(); onToast('Signed out successfully.'); onClose() }
  return <div className="drawer-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><aside className="side-panel" role="dialog" aria-modal="true" aria-label="Roamly account"><button className="panel-close" onClick={onClose} aria-label="Close account"><X/></button><p className="kicker">Your Roamly</p><h2>{session ? 'Good to see you.' : mode === 'signin' ? 'Welcome back.' : 'Travel starts here.'}</h2>{session ? <div className="account-state"><div className="account-avatar"><UserRound/></div><p>{session.user.email}</p><span>Your saved journeys and booking requests stay private to this account.</span><button className="primary-action" onClick={signOut}>Sign out</button></div> : <form className="auth-form" onSubmit={submit}>{mode === 'signup' && <label>Full name<input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/></label>}<label>Email<input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}/></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}/></label>{error && <p className="form-error">{error}</p>}<button className="primary-action" disabled={busy}>{busy ? <LoaderCircle className="spin" size={17}/> : null}{mode === 'signin' ? 'Sign in' : 'Create account'}</button><button type="button" className="text-action" onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError('') }}>{mode === 'signin' ? 'New here? Create an account' : 'Already a member? Sign in'}</button></form>}</aside></div>
}

function BookingPanel({ trip, open, onClose, search, setSearch, session, onNeedAuth, onToast }) {
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (!open || !trip) return null
  const subtotal = trip.price * search.guests
  const fee = Math.round(subtotal * .06)
  const total = subtotal + fee
  const submit = async e => {
    e.preventDefault(); setError('')
    if (!search.date) return setError('Choose a departure date to continue.')
    if (!session) { onNeedAuth(); return }
    if (!isSupabaseConfigured) return setError('Live booking will activate when the dedicated Roamly Supabase project is connected.')
    setBusy(true)
    const { error: bookingError } = await supabase.rpc('create_booking', { p_journey_id: trip.id, p_departure_date: search.date, p_travellers: search.guests, p_notes: notes || null })
    setBusy(false)
    if (bookingError) return setError(bookingError.message)
    onToast(`Journey request sent for ${trip.city}.`); onClose()
  }
  return <div className="drawer-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><aside className="side-panel booking-panel" role="dialog" aria-modal="true" aria-label={`Book ${trip.city}`}><button className="panel-close" onClick={onClose} aria-label="Close booking"><X/></button><p className="kicker">Private departure</p><h2>Make {trip.city}<br/><em>yours.</em></h2><div className="booking-mini"><img src={trip.image} alt=""/><div><b>{trip.city}</b><span>{trip.country} · {trip.nights} nights</span></div></div><form className="booking-form" onSubmit={submit}><label>Departure<input required type="date" min={new Date().toISOString().slice(0,10)} value={search.date} onChange={e => setSearch(s => ({ ...s, date: e.target.value }))}/></label><label>Travellers<div className="panel-stepper"><button type="button" onClick={() => setSearch(s => ({ ...s, guests: Math.max(1, s.guests - 1) }))}><Minus size={15}/></button><b>{search.guests}</b><button type="button" onClick={() => setSearch(s => ({ ...s, guests: Math.min(12, s.guests + 1) }))}><Plus size={15}/></button></div></label><label>Anything we should know?<textarea rows="3" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anniversary, dietary notes, pace preferences…"/></label><div className="price-lines"><span>Journey <b>{money.format(subtotal)}</b></span><span>Planning & support <b>{money.format(fee)}</b></span><strong>Total <b>{money.format(total)}</b></strong></div>{error && <p className="form-error">{error}</p>}<button className="primary-action" disabled={busy}>{busy ? <LoaderCircle className="spin" size={17}/> : null}Request this journey</button><small>No payment is taken in this portfolio booking flow.</small></form></aside></div>
}

function App() {
  const [journeys, setJourneys] = useState(fallbackDestinations)
  const [catalogState, setCatalogState] = useState(isSupabaseConfigured ? 'loading' : 'demo')
  const [saved, setSaved] = useState(['kyoto'])
  const [savedOnly, setSavedOnly] = useState(false)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [bookingTrip, setBookingTrip] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [session, setSession] = useState(null)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState({ where: '', date: '', guests: 2 })
  const filters = ['All', 'Coastal', 'Culture', 'Adventure', 'Design', 'Wellness', 'Mountains']

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    supabase.from('journeys').select('*').eq('active', true).order('featured', { ascending: false }).then(({ data, error }) => {
      if (error) setCatalogState('error')
      else if (data?.length) { setJourneys(data.map(mapJourney)); setCatalogState('live') }
      else setCatalogState('empty')
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session || !isSupabaseConfigured || catalogState !== 'live') return
    supabase.from('saved_journeys').select('journey_id').eq('user_id', session.user.id).then(({ data }) => data && setSaved(data.map(x => x.journey_id)))
  }, [session, catalogState])

  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 3200); return () => clearTimeout(id) }, [toast])

  const visible = useMemo(() => journeys.filter(d => (filter === 'All' || d.vibe === filter) && (!savedOnly || saved.includes(d.id) || saved.includes(d.slug)) && `${d.city} ${d.country} ${d.vibe}`.toLowerCase().includes(query.toLowerCase())), [journeys, filter, query, savedOnly, saved])

  const toggleSaved = async trip => {
    const key = catalogState === 'live' ? trip.id : (trip.slug || trip.id)
    const exists = saved.includes(key)
    setSaved(s => exists ? s.filter(x => x !== key) : [...s, key])
    if (!session || !isSupabaseConfigured || catalogState !== 'live') { setToast(exists ? 'Removed from saved journeys.' : 'Saved for later. Sign in to sync across devices.'); return }
    const action = exists ? supabase.from('saved_journeys').delete().eq('user_id', session.user.id).eq('journey_id', trip.id) : supabase.from('saved_journeys').insert({ user_id: session.user.id, journey_id: trip.id })
    const { error } = await action
    if (error) { setSaved(s => exists ? [...s, key] : s.filter(x => x !== key)); setToast('Could not update saved journeys. Please try again.') }
  }

  const runSearch = () => { setQuery(search.where.trim()); setSavedOnly(false); document.querySelector('#stays')?.scrollIntoView({ behavior: 'smooth' }) }
  const openBooking = trip => { setSelected(null); setBookingTrip(trip) }

  return <main>
    <Header savedCount={saved.length} savedOnly={savedOnly} onSaved={() => { setSavedOnly(v => !v); document.querySelector('#stays')?.scrollIntoView({ behavior: 'smooth' }) }} session={session} onAccount={() => setAuthOpen(true)}/>
    <Hero search={search} setSearch={setSearch} onSearch={runSearch}/>

    <section className="intro section" id="stays"><div><p className="kicker">The Roamly edit</p><h2>Places with a<br/><em>point of view.</em></h2></div><p>We look beyond the obvious to find stays and experiences with soul — then shape them into trips that feel effortless from first click to final sunset.</p></section>

    <section className="catalog section">
      <div className="catalog-toolbar"><div className="filters">{filters.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="inline-search"><Search size={16}/><input aria-label="Search curated journeys" placeholder="Search the edit" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={14}/></button>}</label></div>
      {catalogState === 'loading' ? <div className="state-card"><LoaderCircle className="spin"/><h3>Curating journeys…</h3><p>Loading the latest departures.</p></div> : catalogState === 'error' ? <div className="state-card error"><Compass/><h3>We lost the trail.</h3><p>The live catalog could not load. Refresh to try again.</p><button onClick={() => location.reload()}>Try again</button></div> : visible.length ? <div className="trip-grid">{visible.map(trip => <DestinationCard key={trip.id} trip={trip} saved={saved.includes(catalogState === 'live' ? trip.id : (trip.slug || trip.id))} onSave={toggleSaved} onOpen={setSelected}/>)}</div> : <div className="empty"><Compass size={32}/><h3>{savedOnly ? 'Nothing saved yet' : 'No journeys found'}</h3><p>{savedOnly ? 'Tap the heart on a journey you want to remember.' : 'Try another destination or clear your filters.'}</p><button onClick={() => { setQuery(''); setFilter('All'); setSavedOnly(false) }}>Reset discovery</button></div>}
    </section>

    <section className="manifesto" id="why"><div className="manifesto-photo"><span>Made by people<br/>who actually go.</span></div><div className="manifesto-copy"><p className="kicker light">Travel, edited better</p><h2>Less planning.<br/><em>More being there.</em></h2><p>Every Roamly journey balances the places you came to see with the moments you could never schedule. We vet the stay, map the route and leave enough room for serendipity.</p><div className="principles"><div><b>01</b><span>Character over category</span></div><div><b>02</b><span>Local, never generic</span></div><div><b>03</b><span>Flexible by design</span></div></div><a href="#journal">How we curate <ArrowRight size={16}/></a></div></section>

    <section className="journal section" id="journal"><div className="section-head"><div><p className="kicker">Notes from elsewhere</p><h2>The travel <em>journal.</em></h2></div><a href="#journal" onClick={e => { e.preventDefault(); setToast('More field notes are being edited for the next release.') }}>Browse all stories <ArrowRight size={16}/></a></div><div className="journal-grid">{journal.map((story, i) => <article key={story.title} className={i === 0 ? 'story featured' : 'story'}><img src={story.image} alt=""/><p>{story.tag}</p><h3>{story.title}</h3><button onClick={() => setToast(`Opening “${story.title}” soon — journal detail is the next content module.`)}>Read story <ArrowRight size={15}/></button></article>)}</div></section>

    <section className="cta-band"><p className="kicker light">Not sure where yet?</p><h2>Tell us how you want to <em>feel.</em></h2><p>We'll turn a mood, a season and a few free days into somewhere worth going.</p><button onClick={() => { setQuery(''); setFilter('All'); setSavedOnly(false); document.querySelector('#stays')?.scrollIntoView({ behavior: 'smooth' }) }}>Start with the edit <ArrowRight size={17}/></button></section>

    <footer><a className="brand footer-brand" href="#top"><span>R</span>ROAMLY</a><p>Curated journeys for curious people.</p><div><a href="#stays">Journeys</a><a href="#why">About</a><a href="#journal">Journal</a></div><small>© 2026 Roamly. Portfolio concept by Muhammad Abdullah.</small></footer>

    <TripModal trip={selected} onClose={() => setSelected(null)} onBook={openBooking}/>
    <AuthPanel open={authOpen} onClose={() => setAuthOpen(false)} session={session} onToast={setToast}/>
    <BookingPanel trip={bookingTrip} open={Boolean(bookingTrip)} onClose={() => setBookingTrip(null)} search={search} setSearch={setSearch} session={session} onNeedAuth={() => { setBookingTrip(null); setAuthOpen(true) }} onToast={setToast}/>
    {toast && <div className="toast" role="status">{toast}</div>}
  </main>
}

export default App
