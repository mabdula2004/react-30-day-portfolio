import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronDown, Compass, Heart, MapPin, Menu, Minus, Plus, Search, Star, Users, X } from 'lucide-react'
import { destinations, journal } from './data/destinations.js'

const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })

function Header({ savedCount, onSaved }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Roamly home"><span>R</span>ROAMLY</a>
    <nav className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
      <a href="#stays" onClick={() => setOpen(false)}>Journeys</a>
      <a href="#why" onClick={() => setOpen(false)}>Our approach</a>
      <a href="#journal" onClick={() => setOpen(false)}>Journal</a>
      <button className="saved-link" onClick={onSaved}><Heart size={16}/> Saved <b>{savedCount}</b></button>
    </nav>
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
  </header>
}

function SearchBar({ onSearch }) {
  const [where, setWhere] = useState('Anywhere inspiring')
  const [guests, setGuests] = useState(2)
  return <form className="search-shell" onSubmit={e => { e.preventDefault(); onSearch(where) }}>
    <label><span>Where</span><div><MapPin size={17}/><input value={where} onChange={e => setWhere(e.target.value)} aria-label="Destination"/></div></label>
    <label><span>When</span><button type="button" className="field-button"><CalendarDays size={17}/>Oct 18 — 25<ChevronDown size={15}/></button></label>
    <label><span>Travellers</span><div className="guest-stepper"><Users size={17}/><button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}><Minus size={14}/></button><b>{guests}</b><button type="button" onClick={() => setGuests(guests + 1)}><Plus size={14}/></button></div></label>
    <button className="search-cta" aria-label="Search journeys"><Search size={19}/><span>Explore</span></button>
  </form>
}

function Hero({ onSearch }) {
  return <section className="hero" id="top">
    <div className="hero-image"/>
    <div className="hero-shade"/>
    <div className="hero-copy">
      <p className="kicker light">Curated escapes · thoughtfully made</p>
      <h1>Go somewhere<br/><em>worth remembering.</em></h1>
      <p className="hero-sub">Distinctive stays, unhurried itineraries and local moments — brought together in one beautifully simple journey.</p>
    </div>
    <div className="hero-note"><span>01</span><p>Made for the curious,<br/>not the crowds.</p></div>
    <SearchBar onSearch={onSearch}/>
  </section>
}

function DestinationCard({ trip, saved, onSave, onOpen }) {
  return <article className="trip-card">
    <button className={saved ? 'heart active' : 'heart'} onClick={() => onSave(trip.id)} aria-label={`${saved ? 'Remove' : 'Save'} ${trip.city}`}><Heart size={18} fill={saved ? 'currentColor' : 'none'}/></button>
    <button className="image-button" onClick={() => onOpen(trip)} aria-label={`View ${trip.city}`}><img src={trip.image} alt={`${trip.city}, ${trip.country}`}/><span className="vibe">{trip.vibe}</span></button>
    <div className="trip-body">
      <div className="trip-top"><div><p>{trip.eyebrow}</p><h3>{trip.city}</h3><span>{trip.country}</span></div><div className="rating"><Star size={14} fill="currentColor"/>{trip.rating}</div></div>
      <div className="trip-meta"><span>{trip.nights} nights</span><span>from <strong>{money.format(trip.price)}</strong> pp</span></div>
    </div>
  </article>
}

function TripModal({ trip, onClose }) {
  if (!trip) return null
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="trip-modal" role="dialog" aria-modal="true" aria-label={`${trip.city} journey details`}>
      <button className="modal-close" onClick={onClose}><X/></button>
      <div className="modal-photo"><img src={trip.image} alt=""/><span>{trip.nights} nights · {trip.vibe}</span></div>
      <div className="modal-copy"><p className="kicker">{trip.country} · private departure</p><h2>{trip.city}</h2><p>{trip.description}</p>
        <div className="modal-highlights"><span>Design-led stay</span><span>Local host</span><span>Flexible arrival</span></div>
        <div className="modal-footer"><div><small>From, per traveller</small><strong>{money.format(trip.price)}</strong></div><button>Build this journey <ArrowRight size={17}/></button></div>
      </div>
    </section>
  </div>
}

function App() {
  const [saved, setSaved] = useState(['kyoto'])
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const filters = ['All', 'Coastal', 'Culture', 'Adventure', 'Wellness', 'Mountains']
  const visible = useMemo(() => destinations.filter(d => (filter === 'All' || d.vibe === filter) && `${d.city} ${d.country} ${d.vibe}`.toLowerCase().includes(query.toLowerCase())), [filter, query])
  const toggleSaved = id => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return <main>
    <Header savedCount={saved.length} onSaved={() => document.querySelector('#stays')?.scrollIntoView({ behavior: 'smooth' })}/>
    <Hero onSearch={value => { setQuery(value === 'Anywhere inspiring' ? '' : value); document.querySelector('#stays')?.scrollIntoView({ behavior: 'smooth' }) }}/>

    <section className="intro section" id="stays">
      <div><p className="kicker">The Roamly edit</p><h2>Places with a<br/><em>point of view.</em></h2></div>
      <p>We look beyond the obvious to find stays and experiences with soul — then shape them into trips that feel effortless from first click to final sunset.</p>
    </section>

    <section className="catalog section">
      <div className="catalog-toolbar"><div className="filters">{filters.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="inline-search"><Search size={16}/><input placeholder="Search the edit" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button onClick={() => setQuery('')}><X size={14}/></button>}</label></div>
      {visible.length ? <div className="trip-grid">{visible.map(trip => <DestinationCard key={trip.id} trip={trip} saved={saved.includes(trip.id)} onSave={toggleSaved} onOpen={setSelected}/>)}</div> : <div className="empty"><Compass size={32}/><h3>No journeys found</h3><p>Try another destination or clear your filters.</p><button onClick={() => { setQuery(''); setFilter('All') }}>Reset discovery</button></div>}
    </section>

    <section className="manifesto" id="why">
      <div className="manifesto-photo"><span>Made by people<br/>who actually go.</span></div>
      <div className="manifesto-copy"><p className="kicker light">Travel, edited better</p><h2>Less planning.<br/><em>More being there.</em></h2><p>Every Roamly journey balances the places you came to see with the moments you could never schedule. We vet the stay, map the route and leave enough room for serendipity.</p><div className="principles"><div><b>01</b><span>Character over category</span></div><div><b>02</b><span>Local, never generic</span></div><div><b>03</b><span>Flexible by design</span></div></div><a href="#journal">How we curate <ArrowRight size={16}/></a></div>
    </section>

    <section className="journal section" id="journal"><div className="section-head"><div><p className="kicker">Notes from elsewhere</p><h2>The travel <em>journal.</em></h2></div><a href="#top">Browse all stories <ArrowRight size={16}/></a></div><div className="journal-grid">{journal.map((story, i) => <article key={story.title} className={i === 0 ? 'story featured' : 'story'}><img src={story.image} alt=""/><p>{story.tag}</p><h3>{story.title}</h3><button>Read story <ArrowRight size={15}/></button></article>)}</div></section>

    <section className="cta-band"><p className="kicker light">Not sure where yet?</p><h2>Tell us how you want to <em>feel.</em></h2><p>We'll turn a mood, a season and a few free days into somewhere worth going.</p><button>Start with a feeling <ArrowRight size={17}/></button></section>

    <footer><a className="brand footer-brand" href="#top"><span>R</span>ROAMLY</a><p>Curated journeys for curious people.</p><div><a href="#stays">Journeys</a><a href="#why">About</a><a href="#journal">Journal</a></div><small>© 2026 Roamly. Portfolio concept by Muhammad Abdullah.</small></footer>
    <TripModal trip={selected} onClose={() => setSelected(null)}/>
  </main>
}

export default App
