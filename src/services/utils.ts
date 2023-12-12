import { groupBy } from "lodash-es";

export function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function Lenght(a: number, b: number) {
  return Math.sqrt(a * a + b * b);
}

export function CallUntilStopped(fn: () => void, delay = 500) {
  fn();

  const interval = setInterval(fn, delay);

  return () => clearInterval(interval);
}

export function GroupBy<T extends object>(data: T[], filter: keyof T) {
  return Object.entries(groupBy(data, filter)).reduce(
    (acc, [key, value]) => acc.set(Number(key), value),
    new Map<number, T[]>()
  );
}

export type DangerouslySetInnerHTML = { __html: string };

export function CreateInnerFromChildrenOrInnerHTML(
  label?: string,
  dangerouslySetInnerHTML?: DangerouslySetInnerHTML
) {
  return {
    dangerouslySetInnerHTML,
    children: dangerouslySetInnerHTML ? undefined : label,
  };
}
