import { db } from "@Services/GameState/gameState";
import { select } from "@Services/GameState/utils/simpleQueryBuilder";

import { EncyclopediaData } from "../Encyclopedia";
import { Tables } from "../common";

export function GetEncyclopediaArticles(parent: number | null) {
  return db.select<EncyclopediaData[]>(
    select({
      table: Tables.Encyclopedia,
      attributes: [
        [Tables.Encyclopedia, "ID"],
        [Tables.Encyclopedia, "body"],
        [Tables.Encyclopedia, "name"],
        [Tables.Encyclopedia, "folder"],
      ],
      where: [
        {
          A: [Tables.Encyclopedia, "parent"],
          value: parent,
          operator: parent === null ? " is " : "=",
        },
      ],
    })
  );
}
