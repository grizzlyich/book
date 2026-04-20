import { useEffect, useState } from "react";
import { api } from "../api";

export default function ReviewsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ exchange_id: "", rating: 5, text: "" });
  const [statusText, setStatusText] = useState("");

  async function load() {
    try {
      const data = await api.reviews();
      setItems(data.results || data);
    } catch (err) {
      setStatusText(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault();
    try {
      await api.createReview({ exchange_id: Number(form.exchange_id), rating: Number(form.rating), text: form.text });
      setForm({ exchange_id: "", rating: 5, text: "" });
      setStatusText("Отзыв сохранён");
      load();
    } catch (err) {
      setStatusText(err.message);
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="card stack">
        <h2>Оставить отзыв</h2>
        <form className="stack" onSubmit={submit}>
          <input className="input" placeholder="ID exchange" value={form.exchange_id} onChange={(e) => setForm({ ...form, exchange_id: e.target.value })} />
          <select className="select" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <textarea className="textarea" placeholder="Текст отзыва" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          <button className="btn" type="submit">Сохранить отзыв</button>
        </form>
        {statusText && <div className="footer-note">{statusText}</div>}
      </div>
      <div className="stack">
        <h2>Мои отзывы</h2>
        <div className="list">
          {items.map((review) => (
            <div className="list-item" key={review.id}>
              <strong>{review.rating}/5</strong>
              <div className="muted">Автор: {review.author?.username} → Получатель: {review.recipient?.username}</div>
              <div>{review.text || "Без текста"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
