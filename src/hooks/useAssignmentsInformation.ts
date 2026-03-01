import { useSearchParams } from "react-router-dom";
import { useAssignment } from "./useAssignments";
import { useShipment } from "./useShipments";
import { useCallback, useEffect, useState } from "react";
import { Assignment, Shipment } from "../types";
import { parsePage } from "../utils";

export const useAssignmentsInformation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const assignmentIdFromUrl = searchParams.get("assignmentId") ?? "";
  const shipmentIdFromUrl = searchParams.get("shipmentId") ?? "";
  const assignmentSearchFromUrl = searchParams.get("q") ?? "";
  const { data: assignmentFromUrl } = useAssignment(
    assignmentIdFromUrl || undefined,
  );
  const { data: shipmentFromUrl } = useShipment(shipmentIdFromUrl || undefined);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null,
  );

  const assignmentPage = parsePage(searchParams.get("assignmentPage"));
  const shipmentPage = parsePage(searchParams.get("shipmentPage"));

  useEffect(() => {
    if (assignmentFromUrl) setSelectedAssignment(assignmentFromUrl);
    else if (!assignmentIdFromUrl) setSelectedAssignment(null);
  }, [assignmentFromUrl, assignmentIdFromUrl]);

  useEffect(() => {
    if (shipmentFromUrl) setSelectedShipment(shipmentFromUrl);
    else if (!shipmentIdFromUrl) setSelectedShipment(null);
  }, [shipmentFromUrl, shipmentIdFromUrl]);

  const setAssignmentPage = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("assignmentPage", String(page));
        return next;
      });
    },
    [setSearchParams],
  );

  const setShipmentPage = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("shipmentPage", String(page));
        return next;
      });
    },
    [setSearchParams],
  );

  const setAssignmentSearch = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set("q", value);
        else next.delete("q");
        next.set("assignmentPage", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  const handleAssignmentSelect = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSelectedShipment(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("assignmentId", assignment.id);
      next.delete("shipmentId");
      next.set("shipmentPage", "1");
      return next;
    });
  };

  const handleShipmentSelect = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("shipmentId", shipment.id);
      return next;
    });
  };

  const handleShipmentUpdate = (updatedShipment: Shipment) => {
    if (selectedShipment?.id === updatedShipment.id) {
      setSelectedShipment(updatedShipment);
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
    selectedAssignment,
    assignmentSearchFromUrl,
    assignmentPage,
    selectedShipment,
    shipmentPage,
    setAssignmentPage,
    setShipmentPage,
    setAssignmentSearch,
    handleAssignmentSelect,
    handleShipmentSelect,
    handleShipmentUpdate,
    handleShipmentDelete,
  };
};
