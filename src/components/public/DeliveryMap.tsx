import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const defaultPosition: [number, number] = [-14.0678, -75.7286];

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DraggableMarker({ position, onChange }: { position: [number, number]; onChange: (position: [number, number]) => void }) {
  useMapEvents({
    click(event) {
      onChange([event.latlng.lat, event.latlng.lng]);
    },
  });

  return (
    <Marker
      draggable
      icon={markerIcon}
      position={position}
      eventHandlers={{
        dragend(event) {
          const marker = event.target;
          const latLng = marker.getLatLng();
          onChange([latLng.lat, latLng.lng]);
        },
      }}
    />
  );
}

export function DeliveryMap({ latitude, longitude, onChange }: { latitude: number | null; longitude: number | null; onChange: (lat: number, lng: number) => void }) {
  const position = useMemo<[number, number]>(() => [latitude ?? defaultPosition[0], longitude ?? defaultPosition[1]], [latitude, longitude]);

  return (
    <div className="overflow-hidden rounded-lg border border-lavanda/70">
      <MapContainer center={position} zoom={14} scrollWheelZoom className="h-72 w-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DraggableMarker position={position} onChange={([lat, lng]) => onChange(lat, lng)} />
      </MapContainer>
    </div>
  );
}
