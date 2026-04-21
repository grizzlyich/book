import { useEffect, useState } from "react";
import { api } from "../api";
import BookCard from "../components/BookCard";

const initial = {
  title: "",
  author: "",
  genre: "",
  description: "",
  condition: "",
  city: "",
  latitude: "",
  longitude: ""
};

const placeholders = {
  title: "Название книги",
  author: "Автор",
  genre: "Жанр",
  description: "Описание",
  condition: "Состояние книги",
  city: "Город",
  latitude: "Широта",
  longitude: "Долгота",
};

function normalizeBookToForm(book) {
  return {
    title: book.title || "",
    author: book.author || "",
    genre: book.genre || "",
    description: book.description || "",
    condition: book.condition || "",
    city: book.city || "",
    latitude: book.latitude ?? "",
    longitude: book.longitude ?? "",
  };
}

export default function MyBooksPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initial);
  const [cover, setCover] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function load() {
    const data = await api.myBooks();
    setItems(data.results || data);
  }

  useEffect(() => { load(); }, []);

  function resetForm(message = "") {
    setForm(initial);
    setCover(null);
    setEditingId(null);
    setStatusText(message);
  }

  function startEdit(book) {
    setEditingId(book.id);
    setForm(normalizeBookToForm(book));
    setCover(null);
    setStatusText(`Редактирование книги: ${book.title}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(event) {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (cover) payload.append("cover_file", cover);

    try {
      setIsSubmitting(true);
      if (editingId) {
        await api.updateBook(editingId, payload);
        resetForm("Карточка книги обновлена");
      } else {
        await api.createBook(payload);
        resetForm("Книга добавлена");
      }
      load();
    } catch (err) {
      setStatusText(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeBook(book) {
    const ok = window.confirm(`Удалить книгу «${book.title}»? Это действие нельзя отменить.`);
    if (!ok) return;

    try {
      await api.deleteBook(book.id);
      if (editingId === book.id) {
        resetForm("Карточка книги удалена");
      } else {
        setStatusText("Карточка книги удалена");
      }
      load();
    } catch (err) {
      setStatusText(err.message);
    }
  }

  return (
    <div className="grid two-columns" style={{ alignItems: "start" }}>
      <div className="card stack">
        <h2>{editingId ? "Редактировать книгу" : "Добавить книгу"}</h2>
        <form className="form-grid" onSubmit={submit}>
          {Object.keys(initial).map((field) => (
            field === "description"
              ? <textarea key={field} className="textarea" placeholder={placeholders[field]} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} style={{ gridColumn: "1 / -1" }} />
              : <input key={field} className="input" placeholder={placeholders[field]} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          ))}
          <label className="file-field" style={{ gridColumn: "1 / -1" }}>
            <span className="btn secondary">{editingId ? "Заменить обложку" : "Выбрать обложку"}</span>
            <span className="file-name">{cover ? cover.name : editingId ? "Файл не выбран — текущая обложка останется" : "Файл не выбран"}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setCover(e.target.files?.[0] || null)} />
          </label>
          <div className="actions" style={{ gridColumn: "1 / -1" }}>
            <button className="btn" type="submit" disabled={isSubmitting}>
              {editingId ? (isSubmitting ? "Сохраняем..." : "Сохранить изменения") : (isSubmitting ? "Сохраняем..." : "Сохранить")}
            </button>
            {editingId && (
              <button className="btn secondary" type="button" onClick={() => resetForm("Редактирование отменено")}>
                Отменить редактирование
              </button>
            )}
          </div>
        </form>
        {statusText && <div className="footer-note">{statusText}</div>}
      </div>
      <div className="stack">
        <h2>Мои книги</h2>
        <div className="grid cards">
          {items.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              action={(
                <>
                  <button className="btn secondary" type="button" onClick={() => startEdit(book)}>
                    Редактировать
                  </button>
                  <button className="btn ghost danger" type="button" onClick={() => removeBook(book)}>
                    Удалить
                  </button>
                </>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
