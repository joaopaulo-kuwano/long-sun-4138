import axios from 'axios'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import fastify from 'fastify'
dotenv.config()

const server = fastify({ logger: false })

interface Game {
  player1: string
  player2: string
  date: string
  place: string
}

export async function GetGamesFromTurn(props: { turn: number, apiKey: string }): Promise<Game[]> {
  try {

    const apiKey = `Bearer ${props.apiKey}`

    const http = await axios({
      url: `https://api.api-futebol.com.br/v1/campeonatos/10/rodadas/${props.turn}`,
      headers: {
        'Authorization': apiKey
      },
    })

    return http.data.partidas.map((e: any) => ({
      player1: e.time_mandante.nome_popular,
      player2: e.time_visitante.nome_popular,
      date: e.data_realizacao_iso,
      place: e.estadio.nome_popular,
    }))

  } catch (err) {
    return []
  }

}

export function GenerateTurnTable(props: { games: Game[], label: string }) {
  const rows = props.games.map(game => {
    return `<tr>
      <td>${dayjs(game.date).format('DD/MM')}</td>
      <td>${dayjs(game.date).format('HH:mm')}</td>
      <td>${game.player1} x ${game.player2}</td>
      <td>${game.place}</td>
    </tr>`
  })

  return `
    <table>
      <caption>${props.label}</caption>
      <tr>
        <th>Data</th>
        <th>Hora</th>
        <th>Jogo</th>
        <th>Local</th>
      </tr>
      ${rows.join('')}
    </table>
  `
}

export function WriteHtmlFile(props: { html: string }) {
  fs.writeFileSync(path.join(__dirname, 'test.html'), props.html)
}

server.get('/', async (req, res) => {
  const { rodada, apiKey } = req.query as any
  if (!rodada || !apiKey) return res.status(400).send({
    err: 'faltando rodada e apiKey'
  })

  // const turn2 = await GetGamesFromTurn({turn: 2, apiKey})
  // const turn3 = await GetGamesFromTurn({turn: 3, apiKey})
  // const turn4 = await GetGamesFromTurn({turn: 4, apiKey})
  // const turn5 = await GetGamesFromTurn({turn: 5, apiKey})
  // const turn6 = await GetGamesFromTurn({turn: 6, apiKey})
  // const turn7 = await GetGamesFromTurn({turn: 7, apiKey})
  const turn8 = await GetGamesFromTurn({turn: 8, apiKey})
  const turn9 = await GetGamesFromTurn({turn: 9, apiKey})
  // const turn10 = await GetGamesFromTurn({turn: 10, apiKey})
  // const turn11 = await GetGamesFromTurn({turn: 11, apiKey})

  // const table2 = GenerateTurnTable({games: turn2, label: '2° Rodada'})
  // const table3 = GenerateTurnTable({games: turn3, label: '3° Rodada'})
  // const table4 = GenerateTurnTable({games: turn4, label: '4° Rodada'})
  // const table5 = GenerateTurnTable({games: turn5, label: '5° Rodada'})
  // const table6 = GenerateTurnTable({games: turn6, label: '6° Rodada'})
  // const table7 = GenerateTurnTable({games: turn7, label: '7° Rodada'})
  const table8 = GenerateTurnTable({games: turn8, label: '8° Rodada'})
  const table9 = GenerateTurnTable({games: turn9, label: '9° Rodada'})
  // const table10 = GenerateTurnTable({games: turn10, label: '10° Rodada'})
  // const table11 = GenerateTurnTable({games: turn11, label: '11° Rodada'})

  const html = `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <style>
      table {
        margin-bottom: 15px;
      }
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
      }
      th, td {
        padding: 10px;
      }
    </style>
    <body>
        ${table8}
        ${table9}
    </body>
    </html>
  `

  return res.status(200).type('text/html').send(html)
})

const start = async () => {
  try {
    await server.listen({ port: 3000 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()