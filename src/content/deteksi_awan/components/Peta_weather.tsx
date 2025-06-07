'use client';

import {
  MapContainer,
  TileLayer,
  ImageOverlay,
  GeoJSON,
  Marker,
  useMap,
  LayersControl,
} from 'react-leaflet';
import { LatLngBounds, LatLngExpression, Map as LeafletMap } from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-velocity/dist/leaflet-velocity.css';
import 'leaflet-velocity';
import L from 'leaflet';
import windDataExample from './Windlayer';

const bounds = new LatLngBounds([-7.28, 107.58], [-6.92, 107.94]);

type VelocityLayerProps = {
  data: any;
};

const VelocityLayer = ({ data }: VelocityLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const L = require('leaflet');
    require('leaflet-velocity');

    let velocityLayer: any;

    if (data) {
      velocityLayer = L.velocityLayer({
        displayValues: false,
        displayOptions: {
          velocityType: 'Wind',
          speedUnit: 'm/s',
          angleConvention: 'bearingCW',
        },
        data,
        maxVelocity: 5,
        velocityScale: 0.015,
        colorScale: ['#76B852', '#FDD835', '#EF5350'],
      });

      velocityLayer.addTo(map);
    }

    return () => {
      if (velocityLayer) map.removeLayer(velocityLayer);
    };
  }, [map, data]);

  return null;
};

type ZoomProps = {
  setMap: (map: LeafletMap) => void;
};

const ZoomToRedArea = ({ setMap }: ZoomProps) => {
  const map = useMap();

  useEffect(() => {
    map.whenReady(() => {
      setMap(map);
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [10, 10] });
    });
  }, [map, setMap]);

  return null;
};

const googleMapsLayer = L.tileLayer(
  'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps',
  }
);

const esriLayer = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri' }
);

type TileSwitcherProps = {
  map: LeafletMap;
};

const ZoomBasedTileSwitcher = ({ map }: TileSwitcherProps) => {
  useEffect(() => {
    if (!map) return;

    let currentLayer: any;

    const handleZoom = () => {
      const zoom = map.getZoom();

      if (currentLayer && map.hasLayer(currentLayer)) {
        map.removeLayer(currentLayer);
      }

      if (zoom >= 16) {
        currentLayer = googleMapsLayer;
      } else {
        currentLayer = esriLayer;
      }

      if (!map.hasLayer(currentLayer)) {
        map.addLayer(currentLayer);
      }
    };

    currentLayer = esriLayer;
    map.addLayer(currentLayer);

    map.on('zoomend', handleZoom);

    return () => {
      map.off('zoomend', handleZoom);
      if (map.hasLayer(currentLayer)) {
        map.removeLayer(currentLayer);
      }
    };
  }, [map]);

  return null;
};

type CuacaTerbaru = {
  waktu: string;
  cuaca: string;
  curah_hujan: string;
};

type PetaCBMProps = {
  refreshTrigger: number;
};

const PetaCBM = ({ refreshTrigger }: PetaCBMProps) => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [geojsonDataList, setGeojsonDataList] = useState<any[]>([]);
  const [cuacaTerbaru, setCuacaTerbaru] = useState<CuacaTerbaru | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12); 

  const getCuacaIcon = (cuaca: string) => {
    if (cuaca.toLowerCase().includes('hujan')) return '/logos/hujan.png';
    if (cuaca.toLowerCase().includes('cerah')) return '/logos/cerah.png';
    return '/image/default.png';
  };

  useEffect(() => {
    fetch('/api/tabel_cuaca_singkat_8')
      .then((res) => res.json())
      .then((data: CuacaTerbaru[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const last = data[data.length - 1];
          setCuacaTerbaru(last);
        }
      })
      .catch((err) => console.error('Gagal memuat data cuaca:', err));
  }, [refreshTrigger]);

  useEffect(() => {
    const files = [
      '/geojson/Majalaya_GeoJson.json',
      '/geojson/Cikaroya_Majalaya_sekitarnya_GeoJson.json',
      '/geojson/Ibun_Geojson.json',
      '/geojson/Pacet_Geojson.json',
      '/geojson/gabung.json',
      '/geojson/gabung_2.json',
      '/geojson/gabung_3.json',
      '/geojson/Mekarjaya.json',
      '/geojson/gabung_4.json',
      '/geojson/gabung_5.json',
    ];

    Promise.all(files.map((file) => fetch(file).then((res) => res.json())))
      .then((results) => setGeojsonDataList(results))
      .catch((err) => console.error('Gagal memuat GeoJSON:', err));
  }, [refreshTrigger]);

  useEffect(() => {
    if (!map) return;
    const handleZoom = () => {
      setZoomLevel(map.getZoom());
    };
    map.on('zoomend', handleZoom);
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map]);

  if (!cuacaTerbaru) {
    return <div className="text-center p-4">Memuat data cuaca...</div>;
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={[-7.1, 107.76]}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={true}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Light">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Overlay hanya muncul jika zoomLevel < 16 */}
        {zoomLevel < 16 && (
          <ImageOverlay
            bounds={bounds}
            url="/api/image"
            opacity={0.78}
          />
        )}

        {geojsonDataList.map((geojsonData, idx) => (
          <div key={idx}>
            <GeoJSON
              data={geojsonData}
              style={() => ({
                color: '#00ffff',
                weight: 6,
                opacity: 0.4,
                fillOpacity: 0,
              })}
            />
            <GeoJSON
              data={geojsonData}
              style={() => ({
                color: '#FFD700',
                weight: 2.5,
                opacity: 1,
                fillOpacity: 0,
              })}
              onEachFeature={(feature: any, layer: any) => {
                const nama = feature.properties?.WADMKC || feature.properties?.name || 'Wilayah';
                const kab = feature.properties?.WADMKK || '-';
                const popupContent = `
                  <div style="text-align:center;">
                    <strong>📍Kecamatan:</strong> ${nama}<br/>
                    <strong>🗺️Kabupaten:</strong> ${kab}<br/>
                    <strong>🕒Waktu:</strong> ${cuacaTerbaru.waktu}<br/>
                    <strong>⛅Cuaca:</strong> ${cuacaTerbaru.cuaca}<br/>
                    <div style="display: flex; justify-content: center; align-items: center; margin-top: 6px;">
                      <img src="${getCuacaIcon(cuacaTerbaru.cuaca)}" alt="cuaca" style="width: 50px; height: 50px; animation: float 2s infinite;" />
                    </div>
                  </div>
                `;
                layer.bindPopup(popupContent);

                layer.on({
                  mouseover: (e: any) => {
                    const l = e.target;
                    l.setStyle({ color: '#ffffff', weight: 5, opacity: 1 });
                    l.bringToFront();
                  },
                  mouseout: (e: any) => {
                    const l = e.target;
                    l.setStyle({ color: '#FFD700', weight: 2.5, opacity: 1 });
                  },
                  click: () => {
                    if (!map) return;
                    const geo = feature.geometry;
                    let latlngs: LatLngExpression[] = [];

                    if (geo?.type === 'Polygon') {
                      latlngs = geo.coordinates[0].map((c: [number, number]) => [c[1], c[0]]);
                    } else if (geo?.type === 'MultiPolygon') {
                      latlngs = geo.coordinates[0][0].map((c: [number, number]) => [c[1], c[0]]);
                    }

                    if (latlngs.length > 0) {
                      const bounds = L.latLngBounds(latlngs);
                      map.flyToBounds(bounds, { padding: [20, 20], duration: 1.5 });
                      layer.openPopup();
                    }
                  },
                });
              }}
            />

            {geojsonData.features?.map((feature: any, i: number) => {
              let center: LatLngExpression = [0, 0];
              const coords = feature.geometry?.coordinates;

              if (feature.geometry.type === 'Polygon') {
                const polyCoords = coords[0];
                const lats = polyCoords.map((c: [number, number]) => c[1]);
                const lngs = polyCoords.map((c: [number, number]) => c[0]);
                const lat = lats.reduce((a: number, b: number) => a + b, 0) / lats.length;
                const lng = lngs.reduce((a: number, b: number) => a + b, 0) / lngs.length;
                center = [lat, lng];
              }

              const namaWilayah = feature.properties?.WADMKC || feature.properties?.name || 'Wilayah';

              return (
                <Marker
                  key={`label-${idx}-${i}`}
                  position={center}
                  icon={L.divIcon({
                    className: 'text-label',
                    html: `<div style="font-size: 11px; font-weight: bold; color: white; text-shadow: 1px 1px 4px rgba(0,0,0,0.7);">${namaWilayah}</div>`,
                  })}
                />
              );
            })}
          </div>
        ))}

        {map && <VelocityLayer data={windDataExample.data} />}
        <ZoomToRedArea setMap={setMap} />
        {map && <ZoomBasedTileSwitcher map={map} />}
      </MapContainer>
    </div>
  );
};

export default PetaCBM;
