import { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Empty } from 'antd'
import type { Shipment } from '../../types'

// Fix for default marker icon issue
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icon for selected shipment
const selectedIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Component to update map center when props change
interface MapControllerProps {
  center: [number, number]
  zoom?: number
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom = 10 }) => {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])

  return null
}

interface ShipmentMapProps {
  lat: number
  lng: number
  shipments?: Shipment[] | null
  selectedShipmentId?: string | null
}

const ShipmentMap: React.FC<ShipmentMapProps> = memo(({ lat, lng, shipments = null, selectedShipmentId = null }) => {
  const { t } = useTranslation()

  // If multiple shipments provided, show all with lines
  if (shipments && shipments.length > 0) {
    const shipmentsWithCoords = shipments.filter((s) => s.lat && s.lng)

    if (shipmentsWithCoords.length === 0) {
      return <Empty description={t('map.noLocation')} />
    }

    const polylinePositions = shipmentsWithCoords.map((s) => [s.lat, s.lng] as [number, number])

    // Center on selected shipment if it has coordinates, otherwise center on first shipment with coordinates
    const selectedShipment = selectedShipmentId
      ? shipmentsWithCoords.find(s => s.id === selectedShipmentId)
      : null
    const centerLat = selectedShipment?.lat || (lat && lat !== 0 ? lat : shipmentsWithCoords[0].lat)
    const centerLng = selectedShipment?.lng || (lng && lng !== 0 ? lng : shipmentsWithCoords[0].lng)
    const center: [number, number] = [centerLat!, centerLng!]

    return (
      <div style={{ width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #d9d9d9' }}>
        <MapContainer center={center} zoom={10} style={{ height: '400px', width: '100%' }}>
          <MapController center={center} zoom={10} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {polylinePositions.length > 1 && (
            <Polyline positions={polylinePositions} color="#3498db" weight={3} opacity={0.7} />
          )}
          {shipmentsWithCoords.map((shipment) => (
            <Marker
              key={shipment.id}
              position={[shipment.lat!, shipment.lng!]}
              icon={selectedIcon}
            >
              <Popup>
                <div>
                  <strong>{shipment.label}</strong>
                  <br />
                  {shipment.client_name}
                  <br />
                  {t('common.status')}: {t(`shipments.status.${shipment.status.toLowerCase()}`)}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    )
  }

  // Single shipment map - need coordinates
  if (!lat || !lng) {
    return <Empty description={t('map.noLocation')} />
  }

  const center: [number, number] = [lat, lng]

  return (
    <div style={{ width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #d9d9d9' }}>
      <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
        <MapController center={center} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div>
              <strong>{t('map.shipmentLocation')}</strong>
              <br />
              Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
})

ShipmentMap.displayName = 'ShipmentMap'

export default ShipmentMap
