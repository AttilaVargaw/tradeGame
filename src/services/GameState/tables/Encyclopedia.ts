import { ID } from "../dbTypes";
import { TableData } from "./common";

export type EncyclopediaData = {
  name: string;
  ID: ID;
  body: string;
  parent?: number | null;
  folder?: boolean;
};

export type EncyclopediaTableName = "Encyclopedia";

export default {
  createData: [
    {
      name: "name",
      type: "TEXT",
    },
    {
      name: "body",
      type: "TEXT",
    },
    { name: "parent", type: "INTEGER" },
    { name: "folder", type: "INTEGER" },
  ],
  name: "Encyclopedia",
  initData: [
    { name: "Ranks in the Guild", folder: true },
    { name: "Unlicensed members", folder: true, parent: 1 },
    { name: "Licensed members", folder: true, parent: 1 },
    { name: "Warrant holders", folder: true, parent: 1 },
    { name: "Master", folder: true, parent: 1 },
    {
      name: "Unlicensed members",
      body: `
      <p>Ordinary crewman</p>
      <p>The rank most start with, who finishes the basic training.</p>
      <p>Able crewman</p>
      <p>An experienced crewman.</p>
      <p>Boatswain</p>
      <p>.</p>
    `,
      parent: 2,
    },
    {
      name: "Warrant holders",
      body: `
      <p>Cook</p>
      <p>.</p>
      <p>Surgeon</p>`,
      parent: 4,
    },
    {
      name: "Master",
      body: `
      <p>Cook</p>
      <p>.</p>
      <p>Surgeon</p>`,
      parent: 5,
    },
    {
      name: "Licensed members",
      body: `
      <p>Chief Engineer</p>
      <p>.</p>
      <p>1st Engineer</p>
      <p>.</p>
      <p>2nd Engineer</p>
      <p>.</p>
      <p>3rd Engineer</p>
      <p>.</p>
      <p>4rt Engineer</p>
      <p>.</p>
      <p>1st Mate</p>
      <p>.</p>
      <p>2nd Mate</p>
      <p>.</p>
      <p>3rd Mate</p>
      <p>.</p>
      <p>4rt Mate</p>
      <p>.</p>
      <p>Master</p>`,
      parent: 3,
    },
  ],
} as TableData<EncyclopediaData>;
