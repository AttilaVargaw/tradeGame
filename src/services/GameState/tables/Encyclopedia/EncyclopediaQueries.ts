import { db } from "@Services/GameState/gameState";
import { select } from "@Services/GameState/utils/SimpleQueryBuider";

import { EncyclopediaData } from "../Encyclopedia";

export function GetEncyclopediaArticles(parent: number | null) {
  return db.select<EncyclopediaData[]>(
    select({
      table: "Encyclopedia",
      attributes: [
        ["Encyclopedia", ["ID", "body", "name", "folder", "parent"]],
      ],
      where: [
        {
          A: ["Encyclopedia", "parent"],
          value: parent,
          operator: parent === null ? " is " : "=",
        },
      ],
    })
  );
}
