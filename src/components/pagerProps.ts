import { CSSProperties, PropsWithChildren } from "react";

import { DangerouslySetInnerHTML } from "@Services/utils";

export type PagerItemProps = PropsWithChildren<{
  active: boolean;
  onChange: () => void;
  style?: CSSProperties;
}>;

export type PagerProps<T, U extends PagerItemProps = PagerItemProps> = {
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
