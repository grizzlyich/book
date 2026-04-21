import { useEffect, useState } from "react";
import { api } from "../api";
import MapView from "../components/MapView";

export default function MapPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.mapBooks().then((data) => setItems(data.results || data)).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="stack">
      <div className="card">
        <h2>Карта доступных книг</h2>
        <div className="muted">На карте отображаются только книги со статусом available и указанными координатами.</div>
        {error && <div className="footer-note">Ошибка: {error}</div>}
      </div>
      <MapView books={items} />
    </div>
  );
}
