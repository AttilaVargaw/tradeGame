export type RouterProps = { [key: string]: React.ReactElement };

export function Router<T extends RouterProps>({
  pages,
  value,
}: {
  pages: T;
  value?: keyof T;
}) {
  if (typeof value === "undefined") {
    return <></>;
  }
  return pages[value];
}
