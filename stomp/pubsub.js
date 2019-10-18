// @ts-check
const amqp = require('amqplib')
const Stomp = require('stompjs')

const q = 'tasks'
// Following destinations are equivalent
const destination = `/topic/${q}`
// const destination = `/exchange/amq.topic/${q}`
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
  // Creates an auto-delete subscription queue of random name bound to `amq.topic` exchange.
  client.subscribe(destination, (message) => {
    console.log(`[STOMP] ${message.body}`)
  })
}, errorHandler)

// AMQP consumer
async function consume() {
  const conn = await amqp.connect('amqp://localhost')
  const ch = await conn.createChannel()
  // Creates an auto-delete queue.
  const queueReply = await ch.assertQueue('', { durable: false, autoDelete: true, exclusive: true })
  console.log(`Auto-delete queue created: ${queueReply.queue}`)
  
  // Following queues bound to `amq.topic` exchange will receive the messages
  ch.bindQueue(queueReply.queue, 'amq.topic', q)
  // ch.bindQueue(queueReply.queue, 'amq.topic', '#')
  
  ch.consume(queueReply.queue, (msg) => {
    console.log(`[AMQP] ${msg.content.toString()}`)
  })
}

consume()
