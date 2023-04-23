import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GameStateContext } from "@Services/GameState/gameState";
import { Label } from "@Components/label";
import Modal from "./Modal";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { EncyclopediaData } from "@Services/GameState/tables/Encyclopedia";
//import { EncyclopediaData } from "@Services/GameState/tables/Encyclopedia";

export const EncyclopediaModal = () => {
  const gameState = useContext(GameStateContext);

  const [article, setArticle] = useState<string | undefined>();
  const [folders, setFolders] = useState<EncyclopediaData[]>();

  const terminalRef = useRef<HTMLDivElement>(null);

  const [currentFolder, setCurrentFolder] = useState<number | null>(null);

  useEffect(() => {
    gameState
      .GetEncyclopediaArticles(currentFolder)
      .then((encyclopediaArticles) => {
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
  }, [gameState, currentFolder]);

  const onFolderClick = useCallback(
    (ID: number) => () => {
      setCurrentFolder(ID);
    },
    []
  );

  return (
    <Modal
      body={() => (
        <TerminalScreen dangerouslySetInnerHTML={article} ref={terminalRef}>
          {folders &&
            folders.map(({ ID, name }) => (
              <Link onClick={onFolderClick(ID)} key={ID}>
                {name}
              </Link>
            ))}
        </TerminalScreen>
      )}
      footer={() => <></>}
      header={() => <Label type="painted">Encyclopedia</Label>}
    ></Modal>
  );
};
