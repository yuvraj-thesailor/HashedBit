import React, { useState } from "react";

const MOVIES = [
  { id: 1, title: "Following", year: 1998, genre: "Neo-Noir", duration: "69 min", rating: 7.5, synopsis: "A struggling writer starts tailing strangers around London for inspiration, until he follows the wrong man." },
  { id: 2, title: "Memento", year: 2000, genre: "Thriller", duration: "113 min", rating: 8.4, synopsis: "A man with no short-term memory hunts his wife's killer using notes, photos, and tattoos as his only memory." },
  { id: 3, title: "Insomnia", year: 2002, genre: "Crime Thriller", duration: "118 min", rating: 7.2, synopsis: "A detective investigating a murder in a town with endless daylight starts unraveling from sleep deprivation and guilt." },
  { id: 4, title: "Batman Begins", year: 2005, genre: "Superhero", duration: "140 min", rating: 8.2, synopsis: "Bruce Wayne trains with a secret order before returning to Gotham to become the symbol the city needs." },
  { id: 5, title: "The Prestige", year: 2006, genre: "Mystery Drama", duration: "130 min", rating: 8.5, synopsis: "Two rival stage magicians escalate their feud until it costs them everything they love." },
  { id: 6, title: "The Dark Knight", year: 2008, genre: "Superhero", duration: "152 min", rating: 9.0, synopsis: "Batman, Gordon, and Harvey Dent take on organized crime, but a new criminal mastermind changes the rules." },
  { id: 7, title: "Inception", year: 2010, genre: "Sci-Fi Heist", duration: "148 min", rating: 8.8, synopsis: "A thief who steals secrets from dreams is offered a shot at redemption: planting an idea instead of stealing one." },
  { id: 8, title: "The Dark Knight Rises", year: 2012, genre: "Superhero", duration: "164 min", rating: 8.4, synopsis: "Eight years after taking the blame for Harvey Dent's crimes, Batman returns to face a new threat to Gotham." },
  { id: 9, title: "Interstellar", year: 2014, genre: "Sci-Fi Drama", duration: "169 min", rating: 8.7, synopsis: "A group of explorers travel through a wormhole in search of a new home for humanity." },
  { id: 10, title: "Dunkirk", year: 2017, genre: "War", duration: "106 min", rating: 7.8, synopsis: "Allied soldiers are surrounded by enemy forces and evacuated during a fierce battle in World War II." },
  { id: 11, title: "Tenet", year: 2020, genre: "Sci-Fi Action", duration: "150 min", rating: 7.3, synopsis: "An agent armed with a single word learns to manipulate the flow of time to stop a global catastrophe." },
  { id: 12, title: "Oppenheimer", year: 2023, genre: "Biographical Drama", duration: "180 min", rating: 8.5, synopsis: "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb." },
];

const SHOWTIMES = ["2:00 PM", "5:30 PM", "8:45 PM", "10:15 PM"];

function genId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let s = "BK";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function App() {
  const [page, setPage] = useState("list");
  const [movie, setMovie] = useState(null);
  const [time, setTime] = useState(SHOWTIMES[0]);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);

  function openMovie(m) {
    setMovie(m);
    setTime(SHOWTIMES[0]);
    setPage("details");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Please enter a valid email";
    if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ""))) newErrors.mobile = "Enter a 10-digit mobile number";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    setBooking({ id: genId(), movie, time, ...form });
    setPage("confirmation");
  }

  return (
    <div className="app">
      <style>{CSS}</style>
      <header className="header">🎬 Nolan Cinemas</header>
      <div className="container">
        {page === "list" && (
          <>
            <h2>Now Showing</h2>
            <p className="subtitle">The films of Christopher Nolan</p>
            <div className="grid">
              {MOVIES.map((m) => (
                <div key={m.id} className="card" onClick={() => openMovie(m)}>
                  <img src={`https://picsum.photos/seed/nolan${m.id}/300/420`} alt={m.title} />
                  <div className="card-body">
                    <h3>{m.title}</h3>
                    <p className="meta">{m.year} · {m.genre}</p>
                    <p className="meta">⭐ {m.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "details" && movie && (
          <>
            <button className="link" onClick={() => setPage("list")}>&larr; Back to movies</button>
            <div className="details">
              <img src={`https://picsum.photos/seed/nolan${movie.id}/300/420`} alt={movie.title} />
              <div>
                <h2>{movie.title} <span className="year">({movie.year})</span></h2>
                <p className="meta">{movie.genre} | {movie.duration} | ⭐ {movie.rating}/10</p>
                <p className="synopsis">{movie.synopsis}</p>
                <label>Select Showtime</label>
                <div className="times">
                  {SHOWTIMES.map((t) => (
                    <button key={t} className={t === time ? "time active" : "time"} onClick={() => setTime(t)}>{t}</button>
                  ))}
                </div>
                <button className="primary" onClick={() => setPage("form")}>Book Seat</button>
              </div>
            </div>
          </>
        )}

        {page === "form" && movie && (
          <div className="form-wrap">
            <button className="link" onClick={() => setPage("details")}>&larr; Back to details</button>
            <div className="card-box">
              <h2>Booking Details</h2>
              <p className="subtitle">{movie.title} — {time}</p>
              <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                {errors.name && <p className="error">{errors.name}</p>}

                <label>Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                {errors.email && <p className="error">{errors.email}</p>}

                <label>Mobile Number</label>
                <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="10-digit number" />
                {errors.mobile && <p className="error">{errors.mobile}</p>}

                <button type="submit" className="primary">Submit</button>
              </form>
            </div>
          </div>
        )}

        {page === "confirmation" && booking && (
          <div className="confirm-wrap">
            <div className="card-box center">
              <div className="checkmark">✔</div>
              <h2>Seat Booked!</h2>
              <p className="subtitle">Your booking is confirmed. See details below.</p>
              <div className="confirm-box">
                {[["Booking ID", booking.id], ["Movie", booking.movie.title], ["Showtime", booking.time],
                  ["Name", booking.name], ["Email", booking.email], ["Mobile", booking.mobile]].map(([k, v]) => (
                  <div className="row" key={k}><span>{k}</span><b>{v}</b></div>
                ))}
              </div>
              <button className="primary" onClick={() => { setPage("list"); setBooking(null); }}>Book Another Movie</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const CSS = `
  * { box-sizing: border-box; }
  .app { min-height: 100vh; background: #f4f5f7; font-family: Arial, Helvetica, sans-serif; color: #222; }
  .header { background: #1f2937; color: #fff; padding: 16px 24px; font-size: 22px; }
  .container { max-width: 1000px; margin: 0 auto; padding: 24px 20px 60px; }
  .subtitle { color: #666; margin-top: 0; }
  .meta { color: #555; font-size: 13px; margin: 2px 0; }
  .link { background: none; border: none; color: #2563eb; cursor: pointer; font-size: 14px; padding: 0; margin-bottom: 16px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .card { background: #fff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .card img { width: 100%; height: 220px; object-fit: cover; display: block; }
  .card-body { padding: 10px 12px; }
  .card-body h3 { font-size: 15px; margin: 0 0 4px; }
  .details { display: grid; grid-template-columns: 260px 1fr; gap: 28px; }
  .details img { width: 100%; border-radius: 6px; border: 1px solid #ddd; }
  .year { color: #888; font-weight: normal; }
  .synopsis { line-height: 1.6; max-width: 520px; }
  label { display: block; font-size: 13px; font-weight: bold; color: #555; margin: 14px 0 6px; }
  .times { display: flex; gap: 8px; flex-wrap: wrap; }
  .time { padding: 8px 14px; border: 1px solid #ccc; background: #fff; border-radius: 4px; cursor: pointer; font-size: 13px; }
  .time.active { background: #2563eb; color: #fff; border-color: #2563eb; }
  .primary { margin-top: 20px; padding: 10px 22px; background: #2563eb; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; }
  input { width: 100%; padding: 9px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
  .error { color: #dc2626; font-size: 12px; margin: 4px 0 0; }
  .form-wrap { max-width: 460px; margin: 0 auto; }
  .card-box { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 24px; }
  .card-box h2 { margin: 0 0 4px; }
  .confirm-wrap { display: flex; justify-content: center; }
  .center { text-align: center; max-width: 420px; }
  .checkmark { width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 22px; margin: 0 auto 12px; }
  .confirm-box { text-align: left; border: 1px solid #eee; border-radius: 4px; padding: 6px 14px; margin: 20px 0; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
  .row span { color: #666; }
`;
