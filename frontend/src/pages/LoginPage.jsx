import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setTokens } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      setError("");
      const data = await api.login(form);
      setTokens(data.access, data.refresh);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card auth-card">
      <h2>Вход</h2>
      <form className="stack" onSubmit={submit}>
        <input className="input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="input" type="password" placeholder="Пароль" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <div className="muted">Ошибка: {error}</div>}
        <button className="btn" type="submit">Войти</button>
      </form>
    </div>
  );
}
