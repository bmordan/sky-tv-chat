const express = require('express')
const app = express()
const sockets = require('express-ws')(app)
const db = require('./redis-client')

const clients = {}

sockets.getWss().on('connection', (ws, req) => {
  const channel = req.url.replace(/.websocket/, '').replace(/\//g, '')
  clients[channel] ? clients[channel].push(ws) : clients[channel] = [ws]
  ws.send(`${clients[channel].length} clients connected`)
})

app.get('/:channel', (req, res) => {
  const { channel } = req.params
  const messages = []
  db
  res.send(messages)
})

app.ws('/:channel/:user', (ws, req) => {
  ws.on('message', msg => {
    const { channel, user } = req.params
    const key = `${channel}|${user}|${new Date().getTime()}`
  })
})

app.listen(3000)
