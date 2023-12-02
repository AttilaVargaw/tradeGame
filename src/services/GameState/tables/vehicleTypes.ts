import { ID } from "../dbTypes";
import type { TableData } from "./common";

export type VehicleTypesName = "VehicleTypes";

export type VehicleTypeData = {
  name: string;
  desc: string;
  price: number;
  type: string;
  speed: number;
  inventorySize: number;
  ID: ID;
};

export type VehicleTypeAttr = "name" | "desc" | "price" | "ID" | "type";

export default {
  name: "VehicleTypes",
  createData: [
    { name: "name", type: "TEXT" },
    { name: "desc", type: "TEXT" },
    { name: "price", type: "REAL" },
    { name: "type", type: "TEXT" },
    { name: "speed", type: "REAL" },
    { name: "inventorySize", type: "INTEGER" },
  ],
  initData: [
    {
      desc: "An elegant and fast flying machine. It is fast, but very fragile at the same time.",
      name: "Light helicopter",
      price: 500000,
      type: "air",
      speed: 300,
      inventorySize: 500,
    },
    {
      desc: "A medium sized flying machine. It is relatively fast, but very fragile at the same time.",
      name: "Medium helicopter",
      price: 1500000,
      type: "air",
      speed: 240,
      inventorySize: 1200,
    },
    {
      desc: "A massive and strong flying machine. It is relatively fast.",
      name: "Heavy cargo helicopter",
      price: 4500000,
      type: "air",
      speed: 180,
      inventorySize: 3000,
    },
    {
      desc: "A light truck.",
      name: "Light truck",
      price: 5000,
      type: "wheeled",
      speed: 120,
      inventorySize: 45000,
    },
    {
      desc: "A heavyweight truck.",
      name: "Heavy truck",
      price: 10000,
      type: "wheeled",
      speed: 100,
      inventorySize: 100000,
    },
    {
      desc: "Light tracked hauler.",
      name: "Light tracked hauler",
      price: 10000,
      type: "tracked",
      speed: 70,
      inventorySize: 140000,
    },
    {
      desc: "Medium tracked hauler",
      name: "Medium tracked hauler",
      price: 10000,
      type: "tracked",
      speed: 60,
      inventorySize: 190000,
    },
    {
      desc: "Heavy tracked hauler",
      name: "Heavy tracked hauler",
      price: 10000,
      type: "tracked",
      speed: 50,
      inventorySize: 250000,
    },
    {
      desc: "Light tracked escort",
      name: "Light tracked escort",
      price: 10000,
      type: "tracked",
      speed: 60,
      inventorySize: 1000,
    },
    {
      desc: "Medium tracked escort",
      name: "Medium tracked escort",
      price: 10000,
      type: "tracked",
      speed: 55,
      inventorySize: 2000,
    },
    {
      desc: "Heavy tracked escort",
      name: "Heavy tracked escort",
      price: 50000,
      type: "tracked",
      speed: 50,
      inventorySize: 4000,
    },
  ],
} as TableData<Partial<VehicleTypeData>>;
