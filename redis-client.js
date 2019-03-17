const redis = require('redis')
const { promisify } = require('util')
const { REDIS_URL } = process.env
const client = redis.createClient(REDIS_URL)

module.exports = {
  set: promisify(client.hset).bind(client),
  get: promisify(client.hgetall).bind(client),
  del: promisify(client.del).bind(client),
  dall: promisify(client.flushall).bind(client)
}