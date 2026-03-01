import { useSearchParams } from "react-router-dom";
import { useShipment } from "./useShipments";
import { useEffect, useState } from "react";
import { Shipment } from "../types";

export const useShipmentsInformation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shipmentIdFromUrl = searchParams.get("shipmentId") ?? "";
  const { data: shipmentFromUrl } = useShipment(shipmentIdFromUrl || undefined);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null,
  );

  useEffect(() => {
    if (shipmentFromUrl) setSelectedShipment(shipmentFromUrl);
    else if (!shipmentIdFromUrl) setSelectedShipment(null);
  }, [shipmentFromUrl, shipmentIdFromUrl]);

  const handleShipmentSelect = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("shipmentId", shipment.id);
      return next;
    });
  };

  const handleShipmentUpdate = (updatedShipment: Shipment) => {
    setSelectedShipment(updatedShipment);
    if (selectedShipment?.id === updatedShipment.id) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("shipmentId", updatedShipment.id);
        return next;
      });
    }
  };

  const handleShipmentDelete = (shipmentId: string) => {
    if (selectedShipment?.id === shipmentId) {
      setSelectedShipment(null);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("shipmentId");
        return next;
      });
    }
  };

  return {
    selectedShipment,
    handleShipmentSelect,
    handleShipmentUpdate,
    handleShipmentDelete,
  };
};
