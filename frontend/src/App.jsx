import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import MyBooksPage from "./pages/MyBooksPage";
import ExchangesPage from "./pages/ExchangesPage";
import ReviewsPage from "./pages/ReviewsPage";
import ProfilePage from "./pages/ProfilePage";
import MapPage from "./pages/MapPage";
import FAQPage from "./pages/FAQPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetailPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="my-books" element={<ProtectedRoute><MyBooksPage /></ProtectedRoute>} />
        <Route path="exchanges" element={<ProtectedRoute><ExchangesPage /></ProtectedRoute>} />
        <Route path="reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
