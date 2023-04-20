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
    { Class: 1, item: 2, num: 1 },
    { Class: 1, item: 3, num: 0.01 },
    { Class: 1, item: 21, num: 0.02 },
    { Class: 1, item: 22, num: 0.01 },
    { Class: 1, item: 23, num: 0.02 },

    { Class: 2, item: 1, num: 1 },
    { Class: 2, item: 4, num: 1 },
    { Class: 2, item: 7, num: 0.01 },
    { Class: 2, item: 21, num: 0.02 },
    { Class: 2, item: 22, num: 0.01 },
    { Class: 2, item: 23, num: 0.02 },

    { Class: 3, item: 1, num: 1 },
    { Class: 3, item: 4, num: 1 },
    { Class: 3, item: 7, num: 0.01 },
    { Class: 3, item: 21, num: 0.02 },
    { Class: 3, item: 22, num: 0.01 },
    { Class: 3, item: 23, num: 0.02 },

    { Class: 4, item: 1, num: 1 },
    { Class: 4, item: 4, num: 1 },
    { Class: 4, item: 7, num: 0.01 },
    { Class: 4, item: 21, num: 0.02 },
    { Class: 4, item: 22, num: 0.01 },
    { Class: 4, item: 23, num: 0.02 },
  ],
} as TableData<ClassDailyRequirement>;
