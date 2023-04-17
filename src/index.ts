import axios from 'axios'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

dotenv.config()

interface Game {
  player1: string
  player2: string
  date: string
  place: string
}

export async function GetGamesFromTurn (props: { turn: number }): Promise<Game[]> {
  try {

    const apiKey = `Bearer ${process.env.APIKEY}`

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

  }catch(err){
    return []
  }

}

export function GenerateTurnTable (props: {games: Game[], label: string}) {
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

export function WriteHtmlFile (props: {html: string}) {
  fs.writeFileSync(path.join(__dirname, 'test.html'), props.html)
}