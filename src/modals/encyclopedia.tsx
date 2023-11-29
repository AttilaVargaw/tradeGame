import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Label } from "@Components/label";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { ID } from "@Services/GameState/dbTypes";
import { EncyclopediaData } from "@Services/GameState/tables/Encyclopedia";
import { GetEncyclopediaArticles } from "@Services/GameState/tables/Encyclopedia/EncyclopediaQueries";

import Modal from "./Modal";

//import { EncyclopediaData } from "@Services/GameState/tables/Encyclopedia";

const header = <Label type="painted">Encyclopedia</Label>;

export const EncyclopediaModal = () => {
  const [article, setArticle] = useState<string | undefined>();
  const [folders, setFolders] = useState<EncyclopediaData[]>();

  const terminalRef = useRef<HTMLDivElement>(null);

  const [currentFolder, setCurrentFolder] = useState<number | null>(null);

  useEffect(() => {
    GetEncyclopediaArticles(currentFolder).then((encyclopediaArticles) => {
      console.log(encyclopediaArticles);
      if (encyclopediaArticles[0].folder) {
        setArticle(undefined);
        setFolders(encyclopediaArticles);
      } else {
        setArticle(
          `<h1>${encyclopediaArticles[0].name}</h1>` +
            encyclopediaArticles[0].body
        );
        setFolders(undefined);
      }
    });
  }, [currentFolder]);

  const onFolderClick = useCallback(
    (ID: ID) => () => {
      setCurrentFolder(ID);
    },
    []
  );

  const body = useMemo(
    () => (
      <TerminalScreen dangerouslySetInnerHTML={article} ref={terminalRef}>
        {folders &&
          folders.map(({ ID, name }) => (
            <Link onClick={onFolderClick(ID)} key={ID}>
              {name}
            </Link>
          ))}
      </TerminalScreen>
    ),
    [article, folders, onFolderClick]
  );

  return <Modal body={body} header={header}></Modal>;
};
