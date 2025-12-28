import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function GeoMap({ locations, title }) {
  // locations format: [{ lat, lng, label, value, color? }]
  
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="h-96 rounded-xl overflow-hidden">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location, i) => (
            <CircleMarker
              key={i}
              center={[location.lat, location.lng]}
              radius={Math.sqrt(location.value) * 2}
              fillColor={location.color || "#8b5cf6"}
              color="#fff"
              weight={2}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{location.label}</p>
                  <p className="text-slate-600">{location.value} requests</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}