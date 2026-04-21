import { useEffect, useState } from "react";
import { api, getApiBaseUrl } from "../api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    api.me().then(setProfile).catch((err) => setStatusText(err.message));
  }, []);

  async function submit(event) {
    event.preventDefault();
    try {
      const updated = await api.updateMe(profile);
      setProfile(updated);
      setStatusText("Профиль обновлён");
    } catch (err) {
      setStatusText(err.message);
    }
  }

  if (!profile) return <div className="card">Загрузка...</div>;

  return (
    <div className="card stack">
      <h2>Профиль</h2>
      <div className="muted">Подключённый API: {getApiBaseUrl()}</div>
      <form className="form-grid" onSubmit={submit}>
        <input className="input" value={profile.username} disabled />
        <input className="input" value={profile.email} disabled />
        <input className="input" placeholder="Имя" value={profile.first_name || ""} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} />
        <input className="input" placeholder="Фамилия" value={profile.last_name || ""} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} />
        <input className="input" placeholder="Город" value={profile.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
        <input className="input" placeholder="Адрес" value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
        <input className="input" placeholder="Широта" value={profile.latitude || ""} onChange={(e) => setProfile({ ...profile, latitude: e.target.value })} />
        <input className="input" placeholder="Долгота" value={profile.longitude || ""} onChange={(e) => setProfile({ ...profile, longitude: e.target.value })} />
        <textarea className="textarea" placeholder="О себе" value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} style={{ gridColumn: '1 / -1' }} />
        <button className="btn" type="submit" style={{ gridColumn: '1 / -1' }}>Сохранить</button>
      </form>
      {statusText && <div className="footer-note">{statusText}</div>}
    </div>
  );
}
