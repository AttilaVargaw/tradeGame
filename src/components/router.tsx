import { isUndefined } from "lodash-es";

export type RouterProps = { [key: string]: React.ReactElement };

export function Router<T extends RouterProps>({
  pages,
  value,
}: {
  pages: T;
  value?: keyof T;
}) {
  if (isUndefined(value)) {
    return <></>;
  }
  return pages[value];
}
