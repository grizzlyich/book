import { useEffect, useState } from "react";
import { api } from "../api";
import BookCard from "../components/BookCard";

export default function BooksPage() {
  const [items, setItems] = useState([]);
  const [params, setParams] = useState({ search: "", city: "", genre: "" });
  const [error, setError] = useState("");

  async function load() {
    try {
      const query = new URLSearchParams();
      if (params.search) query.set("search", params.search);
      if (params.city) query.set("city", params.city);
      if (params.genre) query.set("genre", params.genre);
      const data = await api.books(`?${query.toString()}`);
      setItems(data.results || data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="stack">
      <div className="card">
        <h2>Каталог книг</h2>
        <div className="form-grid">
          <input className="input" placeholder="Поиск по названию или автору" value={params.search} onChange={(e) => setParams({ ...params, search: e.target.value })} />
          <input className="input" placeholder="Город" value={params.city} onChange={(e) => setParams({ ...params, city: e.target.value })} />
          <input className="input" placeholder="Жанр" value={params.genre} onChange={(e) => setParams({ ...params, genre: e.target.value })} />
          <button className="btn" onClick={load}>Применить фильтры</button>
        </div>
        {error && <div className="footer-note">Ошибка: {error}</div>}
      </div>
      <div className="grid cards">
        {items.map((book) => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  );
}
