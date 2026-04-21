import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearTokens } from "../api";
import { isAuthenticated } from "../auth";

export default function Layout() {
  const navigate = useNavigate();
  const authed = isAuthenticated();

  return (
    <div className="layout">
      <header className="topbar">
        <div>
          <div className="brand">BookCross</div>
          <div className="muted">Онлайн-платформа обмена книгами</div>
        </div>
        <nav className="nav">
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/books">Каталог</NavLink>
          <NavLink to="/map">Карта</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          {authed && <NavLink to="/my-books">Мои книги</NavLink>}
          {authed && <NavLink to="/exchanges">Обмены</NavLink>}
          {authed && <NavLink to="/reviews">Отзывы</NavLink>}
          {authed && <NavLink to="/profile">Профиль</NavLink>}
          {!authed && <NavLink to="/login">Войти</NavLink>}
          {!authed && <NavLink to="/register">Регистрация</NavLink>}
          {authed && (
            <button className="btn secondary" onClick={() => { clearTokens(); navigate('/login'); }}>
              Выйти
            </button>
          )}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
