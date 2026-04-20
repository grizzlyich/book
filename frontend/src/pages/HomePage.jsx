import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="stack">
      <section className="hero">
        <h1>Меняйтесь книгами онлайн</h1>
        <p>BookCross — это общий веб-сервис для каталога книг, заявок на обмен, отзывов и карты доступных книг.</p>
        <div className="row">
          <Link className="btn" to="/books">Открыть каталог</Link>
          <Link className="btn secondary" to="/register">Создать аккаунт</Link>
        </div>
      </section>
      <section className="grid cards">
        <article className="card"><h3>Каталог</h3><p className="muted">Поиск по книгам, жанрам и городам.</p></article>
        <article className="card"><h3>Обмены</h3><p className="muted">Статусы заявок: pending, accepted, completed.</p></article>
        <article className="card"><h3>Карта</h3><p className="muted">Доступные книги на карте с геоточками.</p></article>
      </section>
    </div>
  );
}
