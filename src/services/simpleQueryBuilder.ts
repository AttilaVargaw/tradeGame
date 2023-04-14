import { Tables } from "./GameState/dbTypes"

export type dbTypes = 'REAL' | 'INTEGER' | 'TEXT'

type Attr = {
    name: string
    type: dbTypes
    references?: string
    referencesOn?: string
    notNullable?: boolean | null
}

function attrToCreateQuery({ name, type, references, referencesOn, notNullable = false }: Attr) {
    return `${name} ${type} ${references ? ` REFERENCES ${references} (${referencesOn})` : ''}`
}

export function create(tableName: Tables, attr: Attr[], drop = true) {
    attr.forEach((a) => {
        if (a.references && !a.referencesOn) {
            a.referencesOn = `ID`
        }
    })

    return `${drop ? `drop table if exists ${tableName};` : ''}CREATE TABLE ${tableName} (ID INTEGER PRIMARY KEY AUTOINCREMENT, ${attr.map(attrToCreateQuery).join(',')});`
}

type JoinEquitation<T, U> = {
    A: Tables | string
    B: Tables | string
    operator?: '=' | '>' | '<' | '<>'
    AAttr: T
    BAttr: U
}

type WhereEquitation<T> = {
    A: Tables
    AAttr: T
    operator?: '=' | '>' | '<' | '<>'
    value: string | number | null
}

function whereEquationToString<T>({ operator = '=', A, AAttr, value = null }: WhereEquitation<T>) {
    const addQuotations = typeof value && AAttr !== "ID"

    return `${A}.${AAttr}${operator}${value ? `${addQuotations ? '"' : ''}${value}${addQuotations ? '"' : ''} ` : 'NULL'}`
}

function joinEquitationToString<T, U>({ operator = '=', A, B, BAttr, AAttr }: JoinEquitation<T, U>) {
    return `${A}.${AAttr}${operator}${B}.${BAttr}`
}

export function select<Attr1 = {}, Attr2 = {}, Attr3 = {}, Attr4 = {}, Attr5 = {}, Attr6 = {}>(
    selectRows: (Attr1 & Attr2 & Attr3 & Attr4 & Attr5 & Attr6[] | { table?: Tables | string, row: (Attr1 & Attr2 & Attr3 & Attr4 & Attr5 & Attr6), as?: string } | string)[],
    table: Tables,
    where?: WhereEquitation<Attr | Attr1 | Attr2 | Attr3 | Attr4 | Attr5 | Attr6>[],
    join?: Join<Attr1 | Attr2 | Attr3 | Attr4 | Attr5 | Attr5 | Attr6, Attr1 | Attr2 | Attr3 | Attr4 | Attr5 | Attr5 | Attr6>[]) {
    return `SELECT ${selectRows.map((item) => {
        if (typeof item === 'string') {
            return `${item}`
        } else {
            const { row, table, as } = item as { table?: Tables | string, row: (Attr1 & Attr2 & Attr3 & Attr4 & Attr5 & Attr6), as?: string }
            return `${table ? `${table}.` : ''}${row}${as ? ` as ${as}` : ''}`
        }
    }).join(',')
        }
        from ${table}${join?.length || 0 > 0 ? join?.map(({ A, equation, as }) => ` inner join ${A} ${as ? ` ${as}` : ''} on ${joinEquitationToString(equation)}`) : ''}${(where?.length || 0) > 0 ? ` WHERE ${where?.map(whereEquationToString).join(',')}` : ''};`
}

export type Join<T, U> = {
    A: T
    equation: JoinEquitation<T, U>
    as?: string
}

//@TODO
export function update<T, Attr = {}, Attr1 = {}, Attr2 = {}, Attr3 = {}, Attr4 = {}, Attr5 = {}, Attr6 = {}>(updateRows: string[],
    table: T,
    where?: WhereEquitation<Attr>[],
    join?: Join<T, Attr1 | Attr2 | Attr3 | Attr4 | Attr5 | Attr5 | Attr6>[]) {
    return `UPDATE ${table}${join ? join.map(({ A, equation }) => ` inner join ${joinEquitationToString(equation)}`).join(',') : ''}${where?.length || 0 > 0 ? ` WHERE ${where?.map(whereEquationToString).join(',')}` : ''};`
}

export function insert<Attr1 extends string | number | symbol>(table: Tables, rows: { [property in Attr1]: string | number | null }) {
    return `insert into ${table} (${Object.keys(rows).join(',')}) values (${Object.values(rows).filter(e => e !== undefined).map(e => `${typeof e === 'string' ? '"' : ''}${e}${typeof e === 'string' ? '"' : ''}`).join(',')})`
}
