import { describe, expect, test } from 'vitest'
import { GenerateTurnTable, GetGamesFromTurn, WriteHtmlFile } from '.'

describe('index.ts', () => {
  test('1 equals 1', () => {
    expect(1).toBe(1)
  })

  test('Get Turn from API', async () => {
    const api = await GetGamesFromTurn({ turn: 2 })
    expect(api.length).toBeGreaterThanOrEqual(1)
    expect(api[0]).toHaveProperty('player1')
    expect(api[0]).toHaveProperty('player2')
  })

  test('Generate Game Table', () => {
    const str = GenerateTurnTable({ games: [{ date: new Date().toISOString(), player1: 'Santos', player2: 'Goiás', place: 'Vila Be' }], label: '2° Rodada' })
    console.log(str)
    expect(str).toBeTruthy()
  })

  test('Write Game Table on file', () => {
    const content = `
      <table>
        <caption>2° Rodada</caption>
        <tr>
          <th>Data</th>
          <th>Hora</th>
          <th>Jogo</th>
          <th>Local</th>
        </tr>
        <tr>
          <td>17/04</td>
          <td>13:17</td>
          <td>Santos x Goiás</td>
          <td>Vila Be</td>
        </tr>
      </table>
    `
    const file = WriteHtmlFile({ html: content })
    expect(file).toBeCalled()
  })
})