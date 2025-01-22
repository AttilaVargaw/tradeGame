import { useEffect, useRef, useState } from "react";

import { Label, Link, TerminalScreen } from "@Components/index";
import { EncyclopediaData } from "@Services/GameState/tables/Encyclopedia";
import { GetEncyclopediaArticles } from "@Services/GameState/tables/Encyclopedia/EncyclopediaQueries";
import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

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

  const onFolderClick = (ID: ID) => () => {
    setCurrentParentFolder((current) => {
      currentFolder && current.push(currentFolder);
      return current;
    });
    setCurrentFolder(ID);
  };

  const body = (
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
  );

  return <Modal body={body} header={Header}></Modal>;
};
