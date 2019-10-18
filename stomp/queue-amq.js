// @ts-check
const amqp = require('amqplib')
const Stomp = require('stompjs')

const q = 'tasks'
const destination = `/amq/queue/${q}`
const client = Stomp.overTCP('localhost', 61613)

const errorHandler = (error) => console.error(error)

// Stomp publisher and consumer
client.connect('guest', 'guest', () => {
  let i = 1
  setInterval(() => {
    console.log(`Sending message ${i}`)
    // Publishes to default exchange. Messages are discarded if there are no subscribers
    client.send(destination, {"content-type": "text/plain"}, `Message ${i++}`)
  }, 1000)
  
  // Throws exception if queue does not exists.
  client.subscribe(destination, (message) => {
    console.log(`[STOMP] ${message.body}`)
  })
}, errorHandler)

// AMQP consumer
async function consume() {
  const conn = await amqp.connect('amqp://localhost')
  const ch = await conn.createChannel()
  // Creates queue if does not exists (else error will be thrown)
  await ch.assertQueue(q, { durable: true , autoDelete: false })
  // Consume from queue `tasks` from default exchange
  ch.consume(q, (msg) => {
    console.log(`[AMQP] ${msg.content.toString()}`)
    // Acknowledge message to remove from queue
    ch.ack(msg)
  })
}

consume()
