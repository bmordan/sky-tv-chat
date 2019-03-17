const express = require('express')
const app = express()
const sockets = require('express-ws')(app)
const db = require('./redis-client')

const clients = {}

const broadcast = (channel, key, msg) => {
  clients[channel].forEach(connected => {
    connected.send([key, msg].join('|'))
  })
}

sockets.getWss().on('connection', (ws, req) => {
  const channel = req.url.split('/')[1]
  clients[channel] ? clients[channel].push(ws) : clients[channel] = [ws]
  ws.send(`${clients[channel].length} clients connected`)
})

app.get('/:channel', (req, res) => {
  db.get(req.params.channel).then(messages => {
    return res.send(messages)
  })
})

app.delete('/:key', (req, res) => {
  const { key } = req.params
  key ? db.del(key) : db.dall()
})

app.ws('/:channel/:user', (ws, req) => {
  ws.on('message', msg => {
    const { channel, user } = req.params
    const key = `${user}|${new Date().getTime()}`
    db.set(channel, key, msg)
    broadcast(channel, key, msg)
  })
})

app.listen(3000)
