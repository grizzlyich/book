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

export default function MyBooksPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initial);
  const [cover, setCover] = useState(null);
  const [statusText, setStatusText] = useState("");

  async function load() {
    const data = await api.myBooks();
    setItems(data.results || data);
  }

  useEffect(() => { load(); }, []);

  async function submit(event) {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (cover) payload.append("cover", cover);
    try {
      await api.createBook(payload);
      setForm(initial);
      setCover(null);
      setStatusText("Книга добавлена");
      load();
    } catch (err) {
      setStatusText(err.message);
    }
  }

  return (
    <div className="grid two-columns" style={{ alignItems: "start" }}>
      <div className="card stack">
        <h2>Добавить книгу</h2>
        <form className="form-grid" onSubmit={submit}>
          {Object.keys(initial).map((field) => (
            field === "description"
              ? <textarea key={field} className="textarea" placeholder={placeholders[field]} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} style={{ gridColumn: "1 / -1" }} />
              : <input key={field} className="input" placeholder={placeholders[field]} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          ))}
          <label className="file-field" style={{ gridColumn: "1 / -1" }}>
            <span className="btn secondary">Выбрать обложку</span>
            <span className="file-name">{cover ? cover.name : "Файл не выбран"}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setCover(e.target.files?.[0] || null)} />
          </label>
          <button className="btn" type="submit" style={{ gridColumn: "1 / -1" }}>Сохранить</button>
        </form>
        {statusText && <div className="footer-note">{statusText}</div>}
      </div>
      <div className="stack">
        <h2>Мои книги</h2>
        <div className="grid cards">
          {items.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      </div>
    </div>
  );
}
