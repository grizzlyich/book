import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="stack">
      <section className="hero">
        <h1>Меняйтесь книгами онлайн</h1>
        <p>
          BookCross — это удобный сервис, где можно добавить свои книги, найти интересные
          предложения у других пользователей, договориться об обмене и оставить отзыв после сделки.
        </p>
        <div className="row">
          <Link className="btn" to="/books">Открыть каталог</Link>
          <Link className="btn secondary" to="/register">Создать аккаунт</Link>
        </div>
      </section>

      <section className="grid cards">
        <article className="card">
          <h3>Каталог книг</h3>
          <p className="muted">Ищи книги по названию, жанру, автору и городу.</p>
        </article>
        <article className="card">
          <h3>Обмены</h3>
          <p className="muted">Отправляй заявки, подтверждай обмены и следи за их статусами.</p>
        </article>
        <article className="card">
          <h3>Карта</h3>
          <p className="muted">Смотри книги на карте, если пользователь указал координаты.</p>
        </article>
        <article className="card">
          <h3>FAQ</h3>
          <p className="muted">На отдельной странице есть простое объяснение, как работает весь сайт.</p>
        </article>
      </section>
    </div>
  );
}
