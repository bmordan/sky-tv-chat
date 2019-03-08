const express = require('express')
const app = express()
const sockets = require('express-ws')(app)
const levelup = require('levelup')
const leveldown = require('leveldown')

const clients = {}
const db = levelup(leveldown('./db'))

sockets.getWss().on('connection', (ws, req) => {
  const channel = req.url.replace(/.websocket/, '').replace(/\//g, '')
  clients[channel] ? clients[channel].push(ws) : clients[channel] = [ws]
  ws.send(`${clients[channel].length} clients connected`)
})

db.on('put', (key, msg) => {
  const [ channel, user, ts ] = key.split('|')
  if (!clients[channel]) clients[channel] = []

  clients[channel].forEach(client => {
    client.send({ msg, user, ts })
  })
})

app.get('/:channel', (req, res) => {
  const { channel } = req.params
  const query = { gte: `${channel}!`, lte: `${channel}~` }
  const channelMessages = db.createReadStream(query)
  const messages = []

  channelMessages.on('data', ({ key, value }) => {
    messages.push({
      key: key.toString(),
      msg: value.toString()
    })
  })

  channelMessages.on('end', () => {
    res.send(messages)
  })
})

app.ws('/:channel/:user', (ws, req) => {
  ws.on('message', msg => {
    const { channel, user } = req.params
    const key = `${channel}|${user}|${new Date().getTime()}`
    db.put(key, msg)
  })
})

app.listen(3000)
