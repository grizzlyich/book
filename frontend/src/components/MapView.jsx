import { useEffect, useMemo, useRef, useState } from "react";

const API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY || "";
const SCRIPT_URL = API_KEY
  ? `https://api-maps.yandex.ru/v3/?apikey=${API_KEY}&lang=ru_RU`
  : "";
const DEFAULT_CENTER = [37.618423, 55.751244]; // [lng, lat]

let yandexMapsPromise = null;

function loadYandexMaps() {
  if (!API_KEY) {
    return Promise.reject(new Error("Не задан VITE_YANDEX_MAPS_API_KEY"));
  }

  if (window.ymaps3) {
    return window.ymaps3.ready.then(() => window.ymaps3);
  }

  if (!yandexMapsPromise) {
    yandexMapsPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-yandex-maps="true"]');
      if (existing) {
        existing.addEventListener("load", async () => {
          await window.ymaps3.ready;
          resolve(window.ymaps3);
        });
        existing.addEventListener("error", () => reject(new Error("Не удалось загрузить API Яндекс Карт")));
        return;
      }

      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.async = true;
      script.dataset.yandexMaps = "true";
      script.onload = async () => {
        try {
          await window.ymaps3.ready;
          resolve(window.ymaps3);
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = () => reject(new Error("Не удалось загрузить API Яндекс Карт"));
      document.head.appendChild(script);
    });
  }

  return yandexMapsPromise;
}

function getCoordinates(book) {
  if (book.latitude == null || book.longitude == null) return null;
  return [Number(book.longitude), Number(book.latitude)];
}

export default function MapView({ books }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const firstCoordinates = useMemo(() => {
    const bookWithCoords = books.find((book) => getCoordinates(book));
    return bookWithCoords ? getCoordinates(bookWithCoords) : DEFAULT_CENTER;
  }, [books]);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      try {
        const ymaps3 = await loadYandexMaps();
        if (cancelled || !containerRef.current || mapRef.current) return;

        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;

        const map = new YMap(containerRef.current, {
          location: {
            center: firstCoordinates,
            zoom: books.length ? 10 : 9,
          },
        });

        map.addChild(new YMapDefaultSchemeLayer());
        map.addChild(new YMapDefaultFeaturesLayer());
        mapRef.current = map;
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Не удалось инициализировать Яндекс Карты");
        }
      }
    }

    initMap();

    return () => {
      cancelled = true;
    };
  }, [firstCoordinates, books.length]);

  useEffect(() => {
    async function syncMarkers() {
      if (!mapRef.current) return;
      const ymaps3 = await loadYandexMaps();
      const { YMapMarker } = ymaps3;

      markerRefs.current.forEach((marker) => {
        mapRef.current.removeChild(marker);
      });
      markerRefs.current = [];

      const validBooks = books.filter((book) => getCoordinates(book));
      if (!validBooks.length) {
        mapRef.current.setLocation({ center: DEFAULT_CENTER, zoom: 9, duration: 200 });
        setSelectedBook(null);
        return;
      }

      validBooks.forEach((book) => {
        const coordinates = getCoordinates(book);
        const markerElement = document.createElement("button");
        markerElement.className = "ymap-marker";
        markerElement.type = "button";
        markerElement.innerHTML = '<span class="ymap-marker__dot"></span>';
        markerElement.setAttribute("aria-label", `${book.title} — ${book.author}`);
        markerElement.addEventListener("click", () => setSelectedBook(book));

        const marker = new YMapMarker({ coordinates }, markerElement);
        mapRef.current.addChild(marker);
        markerRefs.current.push(marker);
      });

      mapRef.current.setLocation({ center: firstCoordinates, zoom: 10, duration: 250 });
      setSelectedBook((current) => current || validBooks[0]);
    }

    syncMarkers().catch((err) => setError(err.message || "Не удалось обновить точки на карте"));
  }, [books, firstCoordinates]);

  useEffect(() => {
    return () => {
      markerRefs.current = [];
      if (mapRef.current && typeof mapRef.current.destroy === "function") {
        mapRef.current.destroy();
      }
      mapRef.current = null;
    };
  }, []);

  if (!API_KEY) {
    return (
      <div className="card stack">
        <h3>Яндекс Карта не настроена</h3>
        <div className="muted">
          Добавь переменную <code>VITE_YANDEX_MAPS_API_KEY</code> во frontend на Vercel и локально в <code>.env</code>.
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      {error && <div className="card footer-note">Ошибка карты: {error}</div>}
      <div className="map-wrap card">
        <div ref={containerRef} className="yandex-map-root" />
      </div>
      {selectedBook && (
        <div className="card">
          <h3>{selectedBook.title}</h3>
          <div className="muted">{selectedBook.author}</div>
          <div className="footer-note">Город: {selectedBook.city || "не указан"}</div>
          <div className="footer-note">Владелец: {selectedBook.owner_name}</div>
        </div>
      )}
    </div>
  );
}
