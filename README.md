# Shipment Management React App

A React application for managing shipments and assignments with interactive maps.

## Features

### Shipments Page
- Two-panel layout: shipment list (left) and details (right)
- Filter shipments by label or client name
- Group shipments by status (OPEN, IN_TRANSIT, DELIVERED)
- View and edit shipment details
- Update shipment status (with assignment requirement for IN_TRANSIT/DELIVERED)
- Update assignment ID, delivery date, and location coordinates
- Interactive map showing shipment location
- Create and delete shipments

### Assignments Page
- Three-panel layout:
  - Panel 1: Assignment list (grouped by status)
  - Panel 2: Assignment details with shipment list
  - Panel 3: Shipment details with map showing all assignment shipments
- Search assignments by label
- View assignment details and associated shipments
- Interactive map showing all shipment locations with connecting lines
- Create and delete assignments (only if empty)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the JSON server (in one terminal):
```bash
npm run server
```
This will start the mock API server on `http://localhost:3001`

3. Start the React development server (in another terminal):
```bash
npm run dev
```
This will start the app on `http://localhost:3000`

## API Endpoints

The app uses json-server to provide REST API endpoints:

- `GET /shipments` - Get all shipments
- `GET /shipments/:id` - Get a specific shipment
- `PUT /shipments/:id` - Update a shipment
- `POST /shipments` - Create a new shipment
- `DELETE /shipments/:id` - Delete a shipment
- `GET /assignments` - Get all assignments
- `GET /assignments/:id` - Get a specific assignment
- `POST /assignments` - Create a new assignment
- `PUT /assignments/:id` - Update an assignment
- `DELETE /assignments/:id` - Delete an assignment
- `GET /statuses` - Get all statuses

## Data Structure

### Shipment
```json
{
  "id": "shp_001",
  "client_name": "SamSung",
  "label": "LAX-581-250521-1",
  "status": "OPEN",
  "arrival_date": "2025-05-28T08:22:57.503Z",
  "delivery_by_date": "2025-05-30T08:22:57.503Z",
  "eta": "2025-05-30T05:22:57.503Z",
  "warehouse_id": "581",
  "assignment_id": "as_123",
  "lat": 37.50625872839932,
  "lng": -122.27532417589653
}
```

### Assignment
```json
{
  "id": "as_002",
  "label": "TX-127",
  "status": "OPEN",
  "clients": ["Samsung", "ShipCo"],
  "shipment_count": 1
}
```

## Technologies Used

- React 18
- React Router DOM
- Axios
- Leaflet & React-Leaflet (for maps)
- Vite (build tool)
- json-server (mock API)

## Notes

- When updating a shipment status from OPEN to IN_TRANSIT or DELIVERED, an assignment must be selected
- When reverting status back to OPEN, the assignment_id is automatically removed
- Assignments can only be deleted if they have no shipments
- The map on the assignments page shows all shipment locations with lines connecting them, centered on the selected shipment
