import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Label } from "@Components/label";
import { Link, TerminalScreen } from "@Components/terminalScreen";
import { ID } from "@Services/GameState/dbTypes";
import { EncyclopediaData } from "@Services/GameState/tables/Encyclopedia";
import { GetEncyclopediaArticles } from "@Services/GameState/tables/Encyclopedia/EncyclopediaQueries";

import Modal from "./Modal";

const Header = <Label type="painted">Encyclopedia</Label>;

export const EncyclopediaModal = () => {
  const [article, setArticle] = useState<EncyclopediaData | null>();
  const [folders, setFolders] = useState<EncyclopediaData[]>();
  const [currentParentFolder, setCurrentParentFolder] = useState<number[]>([]);

  const terminalRef = useRef<HTMLDivElement>(null);

  const [currentFolder, setCurrentFolder] = useState<number | null>(null);

  useEffect(() => {
    GetEncyclopediaArticles(currentFolder).then((encyclopediaArticles) => {
      if (encyclopediaArticles[0].folder) {
        setArticle(undefined);
        setFolders(encyclopediaArticles);
      } else {
        setArticle(encyclopediaArticles[0]);
        setFolders(undefined);
      }
    });
  }, [currentFolder]);

  const onFolderClick = useCallback(
    (ID: ID) => () => {
      setCurrentParentFolder((current) => {
        currentFolder && current.push(currentFolder);
        return current;
      });
      setCurrentFolder(ID);
    },
    [currentFolder]
  );

  const body = useMemo(
    () => (
      <TerminalScreen
        style={{ height: "-webkit-fill-available" }}
        ref={terminalRef}
      >
        {currentFolder !== null && (
          <Link
            onClick={() => {
              setCurrentFolder(currentParentFolder.pop() ?? null);
            }}
          >
            {folders ? "..." : <h1>&larr; {article?.name}</h1>}
          </Link>
        )}
        {folders &&
          !article &&
          folders.map(({ ID, name }) => (
            <Link onClick={onFolderClick(ID)} key={name}>
              {name}
            </Link>
          ))}
        {!folders && article && (
          <div
            dangerouslySetInnerHTML={{
              __html: article.body,
            }}
          />
        )}
      </TerminalScreen>
    ),
    [article, currentFolder, currentParentFolder, folders, onFolderClick]
  );

  return <Modal body={body} header={Header}></Modal>;
};
