import Link from "next/link"

import { createClient } from "@libsql/client/web";

export default async function IndexPage() {
  const client = createClient({ url: process.env.DATABASE_URL! });
  const rs = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");

  const eachTableColumnsCount = await client.batch(
    rs.rows.map((table) => (`SELECT COUNT(*) FROM pragma_table_info('${table.name}');`))
  );

  const tableColumns = rs.rows.map((table, i) => ({
    accessorKey: table.name,
    name: table.name,
    count: eachTableColumnsCount[i].rows[0]["COUNT (*)"],
  })) as { name: string, count: number }[];

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <main className="rounded-lg border border-muted p-4 flex flex-col">
        <h2 className="text-lg font-bold ml-2">Tables</h2>
        {tableColumns.map((table) => (
          <Link key={table.name as string} href={`/table/${table.name}`} className="bg-transparent hover:bg-muted p-2 rounded flex justify-between">
            {table.name as string}

            <span className="ml-auto text-muted-foreground">
              {table.count}
            </span>
          </Link>
        ))}
      </main>
    </section>
  )
}
