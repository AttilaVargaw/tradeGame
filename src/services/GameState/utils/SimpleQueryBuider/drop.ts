export function DropTableIfExist(tableName: string) {
  return `drop table if exists ${tableName};`;
}
