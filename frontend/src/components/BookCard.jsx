import { Link } from "react-router-dom";

const STATUS_LABELS = {
  available: "Доступна",
  reserved: "Забронирована",
  exchanged: "Обмен завершён",
  hidden: "Скрыта",
};

export default function BookCard({ book, action }) {
  const statusLabel = STATUS_LABELS[book.status] || book.status || "Неизвестно";

  return (
    <article className="card">
      {book.cover ? <img className="book-cover" src={book.cover} alt={book.title} /> : <div className="book-cover" />}
      <div className="stack" style={{ marginTop: 12 }}>
        <span className="badge">{statusLabel}</span>
        <h3>{book.title}</h3>
        <div className="muted">{book.author}</div>
        <div className="muted">{book.genre || "Жанр не указан"}</div>
        <div className="muted">{book.city || "Город не указан"}</div>
        <div className="muted">Владелец: {book.owner?.username || book.owner_name || "—"}</div>
        <div className="actions">
          <Link className="btn ghost" to={`/books/${book.id}`}>Подробнее</Link>
          {action}
        </div>
      </div>
    </article>
  );
}
