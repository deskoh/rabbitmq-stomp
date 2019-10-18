// @ts-check
const amqp = require('amqplib')
const Stomp = require('stompjs')

const q = 'tasks'
const destination = `/queue/${q}`
const client = Stomp.overTCP('localhost', 61613)

const errorHandler = (error) => console.error(error)

// Stomp publisher and consumer
client.connect('guest', 'guest', () => {
  let i = 1
  setInterval(() => {
    console.log(`Sending message ${i}`)
    // Publishes to amq.topic exchange. Messages are discarded if there are no subscribers
    client.send(destination, {"content-type": "text/plain"}, `Message ${i++}`)
  }, 1000)
  
  // Creates an durable queue `tasks`
  client.subscribe(destination, (message) => {
    console.log(`[STOMP] ${message.body}`)
  })
}, errorHandler)

// AMQP consumer
async function consume() {
  const conn = await amqp.connect('amqp://localhost')
  const ch = await conn.createChannel()
  // Consume from queue `tasks` from default exchange
  ch.consume(q, (msg) => {
    console.log(`[AMQP] ${msg.content.toString()}`)
    ch.ack(msg)
  })
}

consume()
