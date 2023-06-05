import { notFound } from "next/navigation"
import { createClient } from "@libsql/client/web"
import { type ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"

type TableType = {
  name: string
}

type Props = {
  params: { table: string }
}

export default async function TablePage({ params: { table } }: Props) {
  if (!table) {
    notFound()
  }

  try {
    const client = createClient({ url: process.env.DATABASE_URL! })
    const rs = await client.execute(`SELECT * FROM ${table};`)

    const tableColumns = rs.columns.map((column) => ({
      accessorKey: column,
      name: column,
    })) as ColumnDef<TableType>[]

    return (
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-6">
        <main>
          <h2 className="text-lg font-bold mb-4">{table}</h2>
          <DataTable
            columns={tableColumns}
            data={rs.rows as unknown as TableType[]}
          />
        </main>
      </section>
    )
  } catch (err) {
    notFound()
  }
}
