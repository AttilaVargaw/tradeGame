import { TableData } from "./common";

export type CrewRanks = "CrewRanks";

export type CrewRankData = {
  name: string;
  salary: number;
};

export default {
  name: "Crew",
  createData: [
    { name: "name", type: "TEXT" },
    { name: "salary", type: "INTEGER" },
  ],
  initData: [
    {
      name: "Able crewman class 3",
      salary: 100,
    },
    {
      name: "Able crewman class 2",
      salary: 120,
    },
    {
      name: "Able crewman class 1",
      salary: 140,
    },
    {
      name: "Petty officer",
      salary: 150,
    },
    {
      name: "Chief petty officer",
      salary: 170,
    },
    {
      name: "Master chief petty officer",
      salary: 200,
    },
    {
      name: "Warrant officer class 2",
      salary: 150,
    },
    {
      name: "Warrant officer class 1",
      salary: 170,
    },
    {
      name: "Chief Warrant officer",
      salary: 200,
    },
    {
      name: "Master Chief Warrant officer",
      salary: 230,
    },
    {
      name: "Ensign",
      salary: 150,
    },
    {
      name: "Junior Leutnant",
      salary: 180,
    },
    {
      name: "Leutnant",
      salary: 210,
    },
    {
      name: "Leutnant Commander",
      salary: 240,
    },
    {
      name: "Commander",
      salary: 270,
    },
    {
      name: "Captain",
      salary: 300,
    },
    {
      name: "Fleet Captain",
      salary: 340,
    },
    {
      name: "Commodore",
      salary: 380,
    },
  ],
} as TableData<CrewRankData>;
