import type { TableData } from "./common";

export type VehicleTypesName = "VehicleTypes";

export type VehicleTypeData = {
  name: string;
  desc: string;
  price: number;
  type: string;
};

export type VehicleTypeAttr = "name" | "desc" | "price" | "ID" | "type";

export default {
  name: "VehicleTypes",
  createData: [
    { name: "name", type: "TEXT" },
    { name: "desc", type: "TEXT" },
    { name: "price", type: "REAL" },
    { name: "type", type: "TEXT" },
  ],
  initData: [
    {
      desc: "An elegant and fast flying machine. It is fast, but very fragile at the same time.",
      name: "Light helicopter",
      price: 500000,
      type: "air",
    },
    {
      desc: "A medium sized flying machine. It is relatively fast, but very fragile at the same time.",
      name: "Medium helicopter",
      price: 1500000,
      type: "air",
    },
    {
      desc: "A massive and strong flying machine. It is relatively fast.",
      name: "Heavy cargo helicopter",
      price: 4500000,
      type: "air",
    },
    {
      desc: "A light truck.",
      name: "Light truck",
      price: 5000,
      type: "wheeled",
    },
    {
      desc: "A heavyweight truck.",
      name: "Heavy truck",
      price: 10000,
      type: "wheeled",
    },
    {
      desc: "Light tracked hauler.",
      name: "Light tracked hauler",
      price: 10000,
      type: "tracked",
    },
    {
      desc: "Medium tracked hauler",
      name: "Medium tracked hauler",
      price: 10000,
      type: "tracked",
    },
    {
      desc: "Heavy tracked hauler",
      name: "Heavy tracked hauler",
      price: 10000,
      type: "tracked",
    },
    {
      desc: "Light tracked escort",
      name: "Medium tracked escort",
      price: 10000,
      type: "tracked",
    },
    {
      desc: "Medium tracked escort",
      name: "Medium tracked escort",
      price: 10000,
      type: "tracked",
    },
    {
      desc: "Heavy tracked escort",
      name: "Heavy tracked escort",
      price: 50000,
      type: "tracked",
    },
  ],
} as TableData<VehicleTypeData>;
