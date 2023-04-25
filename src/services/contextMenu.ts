import { BehaviorSubject } from "rxjs";

export type ContextMenuItemProps = {
  labelKey: string;
  onClick: () => void;
  disabled: boolean;
};

const contextMenuSubject = new BehaviorSubject<ContextMenuItemProps[]>([]);
export const contextMenuObservable = contextMenuSubject.asObservable();

export const addToContextMenu = (value: ContextMenuItemProps) => {
  contextMenuSubject.next([value, ...contextMenuSubject.value]);

  return () =>
    contextMenuSubject.next(
      contextMenuSubject.value.filter(
        ({ labelKey }) => labelKey !== value.labelKey
      )
    );
};
