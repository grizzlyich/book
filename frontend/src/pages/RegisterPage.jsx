import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const initial = { username: "", email: "", password: "", first_name: "", last_name: "", city: "", bio: "" };

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      setError("");
      await api.register(form);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card auth-card">
      <h2>Регистрация</h2>
      <form className="form-grid" onSubmit={submit}>
        <input className="input" placeholder="Имя пользователя" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="input" placeholder="Электронная почта" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Пароль" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input className="input" placeholder="Имя" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <input className="input" placeholder="Фамилия" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <input className="input" placeholder="Город" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <textarea className="textarea" placeholder="Коротко о себе" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ gridColumn: '1 / -1' }} />
        {error && <div className="muted" style={{ gridColumn: '1 / -1' }}>Ошибка: {error}</div>}
        <button className="btn" type="submit" style={{ gridColumn: '1 / -1' }}>Создать аккаунт</button>
      </form>
    </div>
  );
}
