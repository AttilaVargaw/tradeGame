import { CSSProperties, PropsWithChildren } from "react";

import { DangerouslySetInnerHTML } from "@Services/utils";

export type PagerItemProps<DATA> = PropsWithChildren<{
  active: boolean;
  onChange: () => void;
  style?: CSSProperties;
  value: DATA | null;
}>;

export type PagerProps<T, U extends PagerItemProps<T> = PagerItemProps<T>> = {
  values: {
    label?: string;
    value: T;
    dangerouslySetInnerHTML?: DangerouslySetInnerHTML;
  }[];
  onChange: (newValue: T) => void;
  selected?: T;
  ItemTemplate?: (props: U) => React.ReactElement;
  style?: CSSProperties;
};
