import { TableData } from "./common";

export type Translations = {
  key: string;
  lang: string;
  translation: string;
};

export type TranslationsTableName = "TradeRouteSeries";

export default {
  name: "TradeRouteSeries",
  createData: [
    { name: "key", type: "TEXT" /*references: "City"*/ },
    { name: "lang", type: "TEXT" /*references: "City"*/ },
    { name: "translation", type: "TEXT" /*references: "City"*/ },
  ],
} as TableData<Translations>;
