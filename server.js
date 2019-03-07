const express = require('express')
const app = express()
const WS = require('express-ws')(app)

const clients = {}

WS.getWss().on('connection', (ws, req) => {
  const channel = req.url.replace(/.websocket/, '').replace(/\//g, '')
  clients[channel] ? clients[channel].push(ws) : clients[channel] = [ws]
  ws.send(`${clients[channel].length} clients connected`)
})

app.ws('/:channel', (ws, req) => {
  ws.on('message', msg => {
    const channel = clients[req.params.channel] || []

    channel.forEach(connected => {
      connected.send(msg)
    })
  })
})

app.listen(3000)
