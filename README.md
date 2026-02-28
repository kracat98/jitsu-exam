# Shipment Management React App

A React application for managing shipments and assignments with pagination, URL state, and interactive maps. Data is loaded via React Query; list and assignment selection support infinite scroll and debounced search.

## Features

### Shipments Page (`/shipments`)

- **Two-panel layout:** Shipment list (left) and shipment details (right).
- **List:** Grouped by status (OPEN, IN_TRANSIT, DELIVERED); debounced search by label or client name; pagination.
- **URL state:** `page`, `q` (search), and `shipmentId` (selected shipment) are synced to the URL so reload and back/forward restore the same view.
- **Details:** View and edit shipment; update status (assignment required for IN_TRANSIT/DELIVERED), assignment, delivery date, and coordinates; interactive map; create and delete shipments.
- **Assignment picker:** Assignments are loaded with infinite scroll (no `useAssignment`); dropdown closes after selection.

### Assignments Page (`/assignments`)

- **Three-panel layout:**
  - **Panel 1:** Assignment list (grouped by status), search, and pagination.
  - **Panel 2:** Assignment details and paginated list of its shipments.
  - **Panel 3:** Shipment details with map showing all assignment shipments.
- **URL state:** `assignmentPage`, `shipmentPage`, `q` (assignment search), `assignmentId`, and `shipmentId` are synced so reload and navigation preserve list page, shipment page, search, and selection.
- **Assignments:** Search by label; create assignment; delete only when the assignment has no shipments (button disabled with tooltip when it has shipments).
- **Shipments in assignment:** Loaded via `getShipmentsByAssignmentId` with pagination; map uses `getShipmentsByAssignmentIdAll` for all assignment shipments.

### Shared behavior

- **Loading / layout:** Lists and detail areas use stable min-heights and spinners to avoid layout shift.
- **i18n:** react-i18next with English and Vietnamese (locales in `src/locales/`).
- **UI:** Ant Design (Layout, Select, Form, Pagination, etc.); theme and primary color configured in `main.tsx`.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (build and dev server)
- **React Router DOM** (routes and URL search params)
- **TanStack React Query** (server state, pagination, infinite queries)
- **Ant Design** (components and theme)
- **Axios** (API client)
- **Leaflet / React-Leaflet** (maps)
- **i18next / react-i18next** (translations)
- **json-server** (mock REST API from `shipments.json`)

## Project structure

```
src/
├── App.tsx                 # Router, layout, nav (Shipments / Assignments)
├── main.tsx                # React Query, Ant Design ConfigProvider, i18n
├── i18n/
│   └── config.ts           # i18next setup (en, vi)
├── locales/
│   ├── en.json
│   └── vi.json
├── pages/
│   ├── ShipmentsPage.tsx   # Shipment list + details; URL: page, q, shipmentId
│   └── AssignmentsPage.tsx # Assignment list + details + shipment details; URL: assignmentPage, shipmentPage, q, assignmentId, shipmentId
├── components/
│   ├── ShipmentList/       # Paginated list + debounced Search; uses useShipments
│   ├── ShipmentListUI/
│   ├── ShipmentDetails/    # Form, map; uses useStatuses, AssignmentsSelect (infinite)
│   ├── ShipmentForm/
│   ├── ShipmentMap/
│   ├── AssignmentList/    # Paginated list + search; uses useAssignmentsPaginated
│   ├── AssignmentListUI/
│   ├── AssignmentDetails/ # Shipments by assignment (paginated); uses useShipmentsByAssignment
│   ├── AssignmentForm/
│   └── shared/
│       ├── AssignmentsSelect.tsx  # Infinite scroll via useAssignmentsInfinite; closes on select
│       ├── Search.tsx             # Debounced search input
│       ├── StatusBadge.tsx
│       ├── Input.tsx
│       └── Button.tsx
├── hooks/
│   ├── index.ts
│   ├── useShipments.ts     # useShipments, useShipmentsByAssignment, useShipmentsByAssignmentAll, useShipment, mutations
│   ├── useAssignments.ts   # useAssignments, useAssignmentsPaginated, useAssignmentsInfinite, useAssignment, mutations
│   └── useStatuses.ts
├── services/
│   └── api.ts              # Axios + all REST calls (shipments, assignments, statuses; paginated & filtered)
├── utils/
│   ├── index.ts
│   ├── formatDate.ts       # formatDate, formatDateTime (locale-aware)
│   └── urlParams.ts        # parsePage for URL pagination
├── types/
│   └── index.ts            # Shipment, Assignment, Status, form types
└── store/
    └── external-store.ts
```

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Start the mock API** (one terminal)

```bash
npm run server
```

Runs json-server with `shipments.json` on `http://localhost:3001`.

3. **Start the dev server** (another terminal)

```bash
npm run dev
```

App runs at `http://localhost:3000`.

4. **Build for production**

```bash
npm run build
npm run preview   # optional: preview production build
```

## API (json-server)

Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/shipments` | List shipments (supports `_page`, `_limit`, `label_like`, `client_name_like`, `assignment_id`) |
| GET | `/shipments/:id` | Single shipment |
| POST | `/shipments` | Create shipment |
| PUT | `/shipments/:id` | Update shipment |
| DELETE | `/shipments/:id` | Delete shipment |
| GET | `/assignments` | List assignments (supports `_page`, `_limit`, `label_like`) |
| GET | `/assignments/:id` | Single assignment |
| POST | `/assignments` | Create assignment |
| PUT | `/assignments/:id` | Update assignment |
| DELETE | `/assignments/:id` | Delete assignment |
| GET | `/statuses` | List statuses |

The app uses paginated and filtered wrappers in `src/services/api.ts` (e.g. `getShipments`, `getShipmentsByAssignmentId`, `getAssignmentsPaginated`).

## Data structures

### Shipment

```json
{
  "id": "shp_0001",
  "client_name": "Samsung",
  "label": "LAX-581-250521-1",
  "status": "IN_TRANSIT",
  "arrival_date": "2026-02-25T03:39:38.009Z",
  "delivery_by_date": "2026-02-27T00:00:00.000Z",
  "eta": "2026-02-26T14:39:38.009Z",
  "warehouse_id": "581",
  "assignment_id": "as_123",
  "lat": 32.57,
  "lng": -97.08
}
```

### Assignment

```json
{
  "id": "as_002",
  "label": "TX-127",
  "status": "OPEN",
  "clients": ["Samsung", "ShipCo"]
}
```

## Notes

- **Shipment status:** IN_TRANSIT and DELIVERED require an assignment; reverting to OPEN clears `assignment_id`.
- **Assignment delete:** Allowed only when the assignment has no shipments; otherwise the delete button is disabled with a tooltip.
- **AssignmentsSelect:** Uses infinite query and scroll-based “load more”; no separate `useAssignment`; dropdown closes after selecting an option or “None”.
- **URL params:** Shipments page uses `page`, `q`, `shipmentId`. Assignments page uses `assignmentPage`, `shipmentPage`, `q`, `assignmentId`, `shipmentId`. Selection and pagination restore on reload.
