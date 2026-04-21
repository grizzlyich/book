import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ books }) {
  const center = books.length ? [Number(books[0].latitude), Number(books[0].longitude)] : [55.751244, 37.618423];

  return (
    <div className="map-wrap card">
      <MapContainer center={center} zoom={10} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {books.map((book) => (
          <Marker key={book.id} position={[Number(book.latitude), Number(book.longitude)]}>
            <Popup>
              <strong>{book.title}</strong><br />
              {book.author}<br />
              {book.city}<br />
              Владелец: {book.owner_name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
