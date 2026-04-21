import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { isAuthenticated } from "../auth";

const STATUS_LABELS = {
  available: "Доступна",
  reserved: "Забронирована",
  exchanged: "Обмен завершён",
  hidden: "Скрыта",
};

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState("");
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    api.book(id).then(setBook).catch((err) => setStatusText(err.message));
  }, [id]);

  async function requestExchange() {
    try {
      await api.createExchange({ book_id: Number(id), message });
      setStatusText("Заявка отправлена");
    } catch (err) {
      setStatusText(err.message);
    }
  }

  if (!book) return <div className="card">Загрузка...</div>;

  return (
    <div className="grid details-grid">
      <div className="card">
        {book.cover ? <img className="book-cover" src={book.cover} alt={book.title} /> : <div className="book-cover" />}
      </div>
      <div className="card stack">
        <span className="badge">{STATUS_LABELS[book.status] || book.status}</span>
        <h2>{book.title}</h2>
        <div className="muted">{book.author}</div>
        <div>{book.description || "Описание не указано"}</div>
        <div className="muted">Жанр: {book.genre || "—"}</div>
        <div className="muted">Состояние: {book.condition || "—"}</div>
        <div className="muted">Город: {book.city || "—"}</div>
        <div className="muted">Владелец: {book.owner?.username || "—"}</div>
        {isAuthenticated() && (
          <div className="stack">
            <textarea className="textarea" placeholder="Сообщение владельцу" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="btn" onClick={requestExchange}>Отправить заявку на обмен</button>
          </div>
        )}
        {statusText && <div className="footer-note">{statusText}</div>}
      </div>
    </div>
  );
}
