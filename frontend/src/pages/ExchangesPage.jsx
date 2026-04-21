import { useEffect, useState } from "react";
import { api } from "../api";

const statuses = [
  { value: "accepted", label: "Подтвердить" },
  { value: "rejected", label: "Отклонить" },
  { value: "completed", label: "Завершить обмен" },
];

const statusLabels = {
  pending: "Ожидает",
  accepted: "Подтверждена",
  rejected: "Отклонена",
  completed: "Завершена",
  cancelled: "Отменена",
};

export default function ExchangesPage() {
  const [items, setItems] = useState([]);
  const [statusText, setStatusText] = useState("");

  async function load() {
    try {
      const data = await api.exchanges();
      setItems(data.results || data);
    } catch (err) {
      setStatusText(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    try {
      await api.updateExchange(id, { status });
      const readable = statuses.find((item) => item.value === status)?.label || status;
      setStatusText(`Статус обновлён: ${readable}`);
      load();
    } catch (err) {
      setStatusText(err.message);
    }
  }

  async function cancel(id) {
    try {
      await api.cancelExchange(id);
      setStatusText("Заявка отменена");
      load();
    } catch (err) {
      setStatusText(err.message);
    }
  }

  return (
    <div className="stack">
      <div className="card">
        <h2>Обмены</h2>
        <div className="footer-note">Здесь владелец книги подтверждает или завершает обмен, а отправитель может отменить активную заявку.</div>
        {statusText && <div className="footer-note">{statusText}</div>}
      </div>
      <div className="list">
        {items.map((item) => (
          <div className="list-item" key={item.id}>
            <strong>{item.book?.title}</strong>
            <div className="muted">Статус: {statusLabels[item.status] || item.status}</div>
            <div className="muted">От: {item.requester?.username} → Владелец: {item.owner?.username}</div>
            <div>{item.message || "Без сообщения"}</div>
            <div className="actions">
              {statuses.map((status) => (
                <button key={status.value} className="btn secondary" onClick={() => setStatus(item.id, status.value)}>{status.label}</button>
              ))}
              <button className="btn ghost" onClick={() => cancel(item.id)}>Отменить заявку</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
