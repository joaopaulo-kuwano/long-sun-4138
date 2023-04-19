import { Inter } from 'next/font/google'
import { Button } from "@blueprintjs/core";
import { Column, Table2, Cell } from '@blueprintjs/table';

export default function Home() {
  return (
    <div>
      <Table2 numRows={5}>
        <Column name="Data" />
        <Column name="Hora" />
        <Column name="Jogo" cellRenderer={() => <Cell></Cell>} />
        <Column name="Local" />
      </Table2>
    </div>
  )
}
