import { CSSProperties, PropsWithChildren } from "react";

export type PagerItemProps = PropsWithChildren<{
  active: boolean;
  onChange: () => void;
  style?: CSSProperties;
}>;

export type PagerProps<
  T = string,
  U extends PagerItemProps = PagerItemProps
> = {
  values: {
    label?: string;
    value: T;
    dangerouslySetInnerHTML?: { __html: string };
  }[];
  onChange: (newValue: T) => void;
  selected?: T;
  ItemTemplate?: (props: U) => JSX.Element;
};
