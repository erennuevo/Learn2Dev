import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

function createMeetupIcon(color = '#4F46E5') {
    return L.divIcon({
        className: 'meetup-marker',
        html: `<div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                transform: rotate(45deg);
                color: white;
                font-size: 12px;
                font-weight: bold;
                line-height: 1;
           ">&#9679;</div>
        </div>`,
        iconSize: [28, 34],
        iconAnchor: [14, 34],
        popupAnchor: [0, -34],
    });
}

function FlyToController({ target }) {
    const map = useMap();
    useEffect(() => {
        if (target) {
            map.flyTo([target.latitude, target.longitude], 17, { duration: 1 });
        }
    }, [target, map]);
    return null;
}

const DEFAULT_CENTER = [14.6349, 121.0778]; // Ateneo de Manila University
const DEFAULT_ZOOM = 15;

export default function MeetupMap({ meetups = [], onMarkerClick, center, zoom = DEFAULT_ZOOM, className = '', flyTo }) {
    const mapCenter = center || DEFAULT_CENTER;

    return (
        <MapContainer
            center={mapCenter}
            zoom={zoom}
            className={`w-full h-full ${className}`}
            style={{ minHeight: '400px' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToController target={flyTo} />
            {meetups.map(meetup => (
                <Marker
                    key={meetup.id}
                    position={[parseFloat(meetup.latitude), parseFloat(meetup.longitude)]}
                    icon={createMeetupIcon(meetup.category_color)}
                    eventHandlers={{
                        click: () => onMarkerClick && onMarkerClick(meetup),
                    }}
                >
                    <Popup>
                        <div className="text-sm">
                            <strong>{meetup.title}</strong>
                            <br />
                            {meetup.location_text && <>{meetup.location_text}<br /></>}
                            {new Date(meetup.meetup_datetime).toLocaleDateString()}
                            <br />
                            {meetup.attendee_count} going
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}