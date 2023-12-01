import React from "react";

export type RouterProps = { [key: string]: JSX.Element };

export function Router<T extends RouterProps>({
  pages,
  value,
}: {
  pages: T;
  value?: keyof T;
}) {
  if (!value) {
    return <></>;
  }
  return pages[value];
}
