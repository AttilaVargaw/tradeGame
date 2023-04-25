import { atom, useAtom } from "jotai";

const contextMenuPositionAtom = atom<[number, number] | null>(null);

export function useContextMenuPosition() {
  return useAtom(contextMenuPositionAtom);
}
