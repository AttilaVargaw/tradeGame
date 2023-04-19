import { TableData } from "./common";

export type ClassDailyRequirement = {
  ID: number;
  num: number;
  item: number;
  Class: number;
};

export default {
  createData: [
    { name: "num", type: "INTEGER" },
    { name: "item", type: "INTEGER" },
    { name: "Class", type: "INTEGER" },
  ],
  name: "ClassDailyRequirement",
  initData: [
    { Class: 1, item: 1, num: 1 },
    { Class: 1, item: 3, num: 0.01 },
    { Class: 2, item: 3, num: 1 },
  ],
} as TableData<ClassDailyRequirement>;
