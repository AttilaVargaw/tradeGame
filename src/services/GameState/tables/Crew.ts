import { TableData } from "./common";

export type CityTableName = "Crew";

export type CrewData = {
  firstName: string;
  secondName: string;
  rank: string;
  vehicle: number;
  crewPosition: number;
};

export default {
  name: "Crew",
  createData: [
    { name: "firstName", type: "TEXT" },
    { name: "secondName", type: "TEXT" },
    { name: "rank", type: "INTEGER" /*references: "CityTypes"*/ },
    { name: "vehicle", type: "INTEGER" },
    { name: "crewPosition", type: "INTEGER" },
  ],
  initData: [{}],
} as TableData<CrewData>;
