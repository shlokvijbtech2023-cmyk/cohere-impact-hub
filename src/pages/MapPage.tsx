import { useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAppStore } from '@/lib/store';
import 'leaflet/dist/leaflet.css';

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const { ngos, resources } = useAppStore();

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import('leaflet').then(L => {
      const map = L.map(mapRef.current!, { scrollWheelZoom: true }).setView([20.5, 78.9], 5);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Fix default marker icon
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
      });

      const ngoIcon = L.divIcon({
        html: `<div style="background:hsl(153,40%,24%);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">N</div>`,
        className: '', iconSize: [32, 32], iconAnchor: [16, 16],
      });

      const resourceIcon = L.divIcon({
        html: `<div style="background:hsl(16,65%,50%);width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">R</div>`,
        className: '', iconSize: [28, 28], iconAnchor: [14, 14],
      });

      // NGO markers
      ngos.filter(n => n.status === 'verified').forEach(ngo => {
        L.marker([ngo.lat, ngo.lng], { icon: ngoIcon })
          .addTo(map)
          .bindPopup(`<div style="font-family:system-ui"><strong>${ngo.name}</strong><br/><small>${ngo.location}</small><br/><small>Meals: ${ngo.mealsServed.toLocaleString()}</small></div>`);
      });

      // Resource markers
      resources.filter(r => r.status === 'available').forEach(res => {
        L.marker([res.lat, res.lng], { icon: resourceIcon })
          .addTo(map)
          .bindPopup(`<div style="font-family:system-ui"><strong>${res.title}</strong><br/><small>${res.location}</small><br/><small>${res.quantity} ${res.unit}</small></div>`);
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [ngos, resources]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 h-screen flex flex-col">
        <div className="container mx-auto px-4 py-4">
          <h1 className="font-display text-2xl font-bold">Live Map</h1>
          <p className="text-sm text-muted-foreground">NGOs, food sources, and donation points</p>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-primary inline-block" /> NGOs</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-accent inline-block" /> Resources</span>
          </div>
        </div>
        <div ref={mapRef} className="flex-1" />
      </div>
    </div>
  );
}
