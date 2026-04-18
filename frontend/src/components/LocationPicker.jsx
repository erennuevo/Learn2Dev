import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const pickerIcon = L.divIcon({
    className: 'location-picker-marker',
    html: `<div style="
        background-color: #EF4444;
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 30],
    iconAnchor: [12, 30],
});

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    return position ? (
        <Marker position={[position.lat, position.lng]} icon={pickerIcon} />
    ) : null;
}

export default function LocationPicker({ value, onChange }) {
    const position = value ? { lat: value.latitude, lng: value.longitude } : null;

    const handleSetPosition = (pos) => {
        onChange({ latitude: pos.lat, longitude: pos.lng });
    };

    return (
        <div className="space-y-2">
            <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                <MapContainer
                    center={position ? [position.lat, position.lng] : [14.6349, 121.0778]}
                    zoom={13}
                    className="w-full h-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={handleSetPosition} />
                </MapContainer>
            </div>
            <p className="text-xs text-gray-500">
                Click on the map to set the meetup location.
            </p>
            {position && (
                <p className="text-xs text-gray-500">
                    Selected: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                </p>
            )}
        </div>
    );
}