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
    {
      name: "Ranks in the Guild",
      body: `
      <p>Able crewman class 3</p>
      <p>The rank most start with, who finishes the basic training. They are crewmen basically on the site training.</p>
      <p>Able crewman class 2</p>
      <p>Every class 3 crewman automatically get promoted to this rank after half year. Some, who performed very well, in the base training, can get this rank immedietly as a recognition for their performance.</p>
      <p>Able crewman class 1</p>
      <p>Every crewman get promoted to this rank automatically after 12 months. The promotion means, that they are capable of handling every aspect of the life form and can perform all of their duties on the required professional level.</p>
      <p>Petty officer</p>
      <p>A crew member can start their carrier as a petty officer, if they accuired at least 2 years of on the job experience, and they have the required basic management skills to plan simple everyday operations.</p>
      <p>Chief Petty officer</p>
      <p>A Petty officer can be promoted to the rank of Chief Petty officer, if they gained 4 years of experience and performed well in their duties as a Petty officer. Their new job will be the management of bigger operations.</p>
      <p>Master Chief Petty officer</p>
      <p>A Chief Petty officer can be promoted to the rank of Master Chief Petty officer, if they gained 6 years of experience and performed well in their duties as a Chief Petty officer. Their new job will be the management of all day to day operations on a vehicle.</p>
      <p>Warrant officer class 2</p>
      <p>The rank most highly educated specialist start with, who finishes the basic training. They are specialist crewmen on the site training.</p>
      <p>Warrant officer class 1</p>
      <p>Every Warrant officer class 2 crewman automatically get promoted to this rank after half year.</p>
      <p>Chief Warrant officer</p>
      <p>These warrant officers are responsible for leading smaller sections or offices.</p>
      <p>Mastter Chief Warrant officer</p>
      <p>These warrant officers are responsible for leading bigger sections or offices. They are usually serve on bases, or in the staff of bigger convoys.</p>
      <p>Ensign</p>
        `,
      parent: 1,
      folder: false,
    },
  ],
} as TableData<EncyclopediaData>;
