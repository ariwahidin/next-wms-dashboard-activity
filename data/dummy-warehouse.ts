import type { Warehouse } from "@/types"

export const warehouses: Warehouse[] = [
  {
    id: "WH-001",
    name: "Jakarta Hub",
    location: "Jakarta, Indonesia",
    capacity: 50000,
    currentLoad: 38500,
    zones: 12,
  },
  {
    id: "WH-002",
    name: "Surabaya Hub",
    location: "Surabaya, Indonesia",
    capacity: 35000,
    currentLoad: 28200,
    zones: 8,
  },
  {
    id: "WH-003",
    name: "Bandung Hub",
    location: "Bandung, Indonesia",
    capacity: 25000,
    currentLoad: 19800,
    zones: 6,
  },
  {
    id: "WH-004",
    name: "Medan Hub",
    location: "Medan, Indonesia",
    capacity: 20000,
    currentLoad: 14500,
    zones: 5,
  },
]
