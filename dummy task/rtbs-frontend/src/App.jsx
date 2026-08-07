import { useEffect, useState } from "react";
import { Clock, Phone, Mail, Users, MessageSquare, X, Plus, Trash2 } from "lucide-react";

// vite.config.js proxies "/api" to http://localhost:5000, so this
// works against the Express server started with `npm run dev` there.
const API_BASE = "/api/bookings";

const STATUS_OPTIONS = ["Booked", "Seated", "Completed", "Cancelled"];

// Small wrapper so every call handles non-2xx responses the same way
async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return null; // DELETE has no body

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.fieldErrors = data?.errors || [];
    throw error;
  }
  return data;
}

// Combines booking_date + booking_time and diffs against "now".
function getHoursUntilReservation(booking_date, booking_time) {
  const bookingDateTime = new Date(`${booking_date}T${booking_time}`);
  const now = new Date();
  const diffMs = bookingDateTime.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60);
}

function formatHoursUntil(hours) {
  const abs = Math.abs(hours);

  if (abs < 1) {
    const minutes = Math.round(abs * 60);
    return hours >= 0 ? `in ${minutes} min` : `${minutes} min ago`;
  }
  if (abs < 24) {
    const rounded = Math.round(abs * 10) / 10;
    return hours >= 0 ? `in ${rounded} hrs` : `${rounded} hrs ago`;
  }
  const days = Math.floor(abs / 24);
  const remHours = Math.round(abs % 24);
  const label = `${days}d ${remHours}h`;
  return hours >= 0 ? `in ${label}` : `${label} ago`;
}

const statusStyles = {
  Booked: "bg-blue-100 text-blue-700",
  Seated: "bg-amber-100 text-amber-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function BookingCard({ booking, onSelect }) {
  const hoursUntil = getHoursUntilReservation(booking.booking_date, booking.booking_time);
  const isFinal = booking.status === "Completed" || booking.status === "Cancelled";

  return (
    <div
      onClick={() => onSelect(booking)}
      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-gray-300 hover:shadow-sm transition"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-gray-900">{booking.customer_name}</p>
          <StatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-gray-500">
          Table {booking.table_number} · {booking.number_of_guests} guests ·{" "}
          {booking.booking_date} at {booking.booking_time.slice(0, 5)}
        </p>
      </div>

      <div className="text-right shrink-0 ml-4">
        <div className="flex items-center gap-1 text-sm text-gray-600 justify-end">
          <Clock size={14} />
          <span>{isFinal ? "—" : formatHoursUntil(hoursUntil)}</span>
        </div>
      </div>
    </div>
  );
}

function BookingDetail({ booking, onClose, onStatusChange, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const hoursUntil = getHoursUntilReservation(booking.booking_date, booking.booking_time);
  const isFinal = booking.status === "Completed" || booking.status === "Cancelled";

  async function handleDelete() {
    if (!window.confirm(`Delete the booking for ${booking.customer_name}?`)) return;
    setDeleting(true);
    try {
      await onDelete(booking.booking_id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-10">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{booking.customer_name}</h2>
          <StatusBadge status={booking.status} />
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" />
            {booking.contact_number}
          </p>
          {booking.email && (
            <p className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              {booking.email}
            </p>
          )}
          <p className="flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            {booking.number_of_guests} guests · Table {booking.table_number}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            {booking.booking_date} at {booking.booking_time.slice(0, 5)}
          </p>
          {booking.special_request && (
            <p className="flex items-start gap-2">
              <MessageSquare size={14} className="text-gray-400 mt-0.5" />
              {booking.special_request}
            </p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-500">{isFinal ? "Reservation closed" : "Hours until reservation"}</span>
          <span className="font-medium text-gray-900">{isFinal ? "—" : formatHoursUntil(hoursUntil)}</span>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-500">Advance payment</span>
          <span className="font-medium text-gray-900">
            ₹{Number(booking.advance_payment).toFixed(2)}
          </span>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <select
            value={booking.status}
            onChange={(e) => onStatusChange(booking.booking_id, e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1.5"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <Trash2 size={14} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

const emptyForm = {
  customer_name: "",
  contact_number: "",
  email: "",
  table_number: "",
  number_of_guests: "",
  booking_date: "",
  booking_time: "",
  special_request: "",
  advance_payment: "0",
};

function NewBookingForm({ onCreate, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await onCreate({
        ...form,
        table_number: Number(form.table_number),
        number_of_guests: Number(form.number_of_guests),
        advance_payment: Number(form.advance_payment || 0),
        email: form.email || null,
        special_request: form.special_request || null,
      });
      onClose();
    } catch (err) {
      setFormError(err.message);
      const byField = {};
      (err.fieldErrors || []).forEach((fe) => (byField[fe.field] = fe.message));
      setFieldErrors(byField);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-10">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">New booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {formError && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-3">{formError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <Field label="Customer name" name="customer_name" value={form.customer_name} onChange={handleChange} error={fieldErrors.customer_name} required />
          <Field label="Contact number" name="contact_number" value={form.contact_number} onChange={handleChange} error={fieldErrors.contact_number} required />
          <Field label="Email (optional)" name="email" type="email" value={form.email} onChange={handleChange} error={fieldErrors.email} />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Table number" name="table_number" type="number" min="1" value={form.table_number} onChange={handleChange} error={fieldErrors.table_number} required />
            <Field label="Guests" name="number_of_guests" type="number" min="1" value={form.number_of_guests} onChange={handleChange} error={fieldErrors.number_of_guests} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" name="booking_date" type="date" value={form.booking_date} onChange={handleChange} error={fieldErrors.booking_date} required />
            <Field label="Time" name="booking_time" type="time" value={form.booking_time} onChange={handleChange} error={fieldErrors.booking_time} required />
          </div>

          <Field label="Advance payment" name="advance_payment" type="number" min="0" step="0.01" value={form.advance_payment} onChange={handleChange} error={fieldErrors.advance_payment} />

          <div>
            <label className="block text-gray-600 mb-1">Special request (optional)</label>
            <textarea
              name="special_request"
              value={form.special_request}
              onChange={handleChange}
              rows={2}
              maxLength={500}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gray-900 text-white rounded-md py-2 font-medium disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Create booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, error, ...inputProps }) {
  return (
    <div>
      <label className="block text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        {...inputProps}
        className={`w-full border rounded-md px-3 py-1.5 ${error ? "border-red-400" : "border-gray-300"}`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchBookings() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await apiRequest(API_BASE);
      setBookings(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleCreate(formData) {
    const created = await apiRequest(API_BASE, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    setBookings((prev) => [...prev, created]);
  }

  async function handleStatusChange(bookingId, status) {
    const updated = await apiRequest(`${API_BASE}/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    setBookings((prev) => prev.map((b) => (b.booking_id === bookingId ? updated : b)));
    setSelectedBooking(updated);
  }

  async function handleDelete(bookingId) {
    await apiRequest(`${API_BASE}/${bookingId}`, { method: "DELETE" });
    setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
    setSelectedBooking(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Table bookings</h1>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${bookings.length} reservations`}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-sm rounded-md px-3 py-2"
          >
            <Plus size={16} />
            New booking
          </button>
        </div>

        {loadError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4 flex items-center justify-between">
            <span>Couldn't load bookings: {loadError}</span>
            <button onClick={fetchBookings} className="underline">
              Retry
            </button>
          </div>
        )}

        {!loading && !loadError && bookings.length === 0 && (
          <p className="text-sm text-gray-500">No bookings yet. Create one to get started.</p>
        )}

        <div className="space-y-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.booking_id} booking={booking} onSelect={setSelectedBooking} />
          ))}
        </div>
      </div>

      {selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {showForm && <NewBookingForm onCreate={handleCreate} onClose={() => setShowForm(false)} />}
    </div>
  );
}
