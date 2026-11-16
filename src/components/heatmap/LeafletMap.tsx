import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Complaint, ComplaintSeverity } from '../../types';

interface LeafletMapProps {
  complaints: Complaint[];
  selectedComplaintId?: string | null;
  onSelectComplaint?: (complaint: Complaint) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  isPickerMode?: boolean;
  pickerCoordinates?: { lat: number; lng: number } | null;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  complaints,
  selectedComplaintId,
  onSelectComplaint,
  onLocationSelect,
  isPickerMode = false,
  pickerCoordinates,
  center = [28.6315, 77.2167], // Central Delhi benchmark
  zoom = 13,
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Fix default Leaflet icon assets
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | EcoSahayak Civic GIS',
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Handle map click in picker mode
    if (isPickerMode) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationSelect?.(lat, lng);
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Map severity to distinct pin colors
    const severityColors: Record<ComplaintSeverity, { bg: string; border: string }> = {
      critical: { bg: '#DC2626', border: '#7F1D1D' },
      high: { bg: '#EA580C', border: '#7C2D12' },
      medium: { bg: '#F2A900', border: '#78350F' },
      low: { bg: '#3E7C4A', border: '#14532D' },
    };

    complaints.forEach(item => {
      if (!item.latitude || !item.longitude) return;

      const colors = severityColors[item.severity] || severityColors.medium;
      const isSelected = selectedComplaintId === item.id;

      // Custom pulsing HTML marker
      const customIcon = L.divIcon({
        className: 'custom-civic-marker',
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            background: ${colors.bg};
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 3px 8px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-weight: bold;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
            ${item.severity === 'critical' ? 'animation: pulse-ring 2s infinite;' : ''}
          ">
            <span>${item.supporterCount}</span>
          </div>
        `,
        iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
        iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13],
      });

      const marker = L.marker([item.latitude, item.longitude], { icon: customIcon });

      // Interactive popup
      const popupHtml = `
        <div style="font-family: 'Open Sans', sans-serif; max-width: 240px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: bold; color: #3E7C4A; font-family: 'Montserrat', sans-serif;">
              ${item.trackingId}
            </span>
            <span style="
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 12px;
              background: ${colors.bg};
              color: #FFF;
              font-weight: 600;
              text-transform: capitalize;
            ">
              ${item.severity}
            </span>
          </div>
          <h4 style="font-size: 12px; font-weight: 700; margin: 0 0 4px 0; color: #29332B; line-height: 1.3;">
            ${item.title}
          </h4>
          <p style="font-size: 11px; color: #666; margin: 0 0 6px 0; line-height: 1.3;">
            ${item.address}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #888; border-top: 1px solid #EEE; padding-top: 4px;">
            <span>Category: <b>${item.category.replace('_', ' ')}</b></span>
            <span>👍 <b>${item.supporterCount}</b> supporters</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectComplaint?.(item);
      });

      markersLayer.addLayer(marker);
    });
  }, [complaints, selectedComplaintId, onSelectComplaint]);

  // Handle picker marker in report mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isPickerMode) return;

    if (pickerCoordinates) {
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng([pickerCoordinates.lat, pickerCoordinates.lng]);
      } else {
        const pickerIcon = L.divIcon({
          className: 'picker-pin',
          html: `
            <div style="
              width: 30px;
              height: 30px;
              background: #F2A900;
              border: 3px solid #244D30;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            "></div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const newMarker = L.marker([pickerCoordinates.lat, pickerCoordinates.lng], {
          icon: pickerIcon,
          draggable: true,
        }).addTo(map);

        newMarker.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          onLocationSelect?.(lat, lng);
        });

        pickerMarkerRef.current = newMarker;
      }
      map.panTo([pickerCoordinates.lat, pickerCoordinates.lng]);
    }
  }, [pickerCoordinates, isPickerMode, onLocationSelect]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#3E7C4A]/30 shadow-md">
      <div ref={mapContainerRef} style={{ width: '100%', height }} />
      {/* Legend overlay */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-xs px-3 py-2 rounded-xl shadow-md border border-[#3E7C4A]/20 text-[11px] font-sans">
        <div className="font-heading font-bold text-[#244D30] mb-1.5 flex items-center gap-1">
          <span>Priority Severity</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[#29332B]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]"></span>
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2A900]"></span>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E7C4A]"></span>
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};
