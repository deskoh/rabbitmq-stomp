// @ts-check
const amqp = require('amqplib')
const Stomp = require('stompjs')

const q = 'tasks'
// Following destinations are equivalent for STOMP subscription
const destination = `/topic/${q}`
// const destination = `/exchange/amq.topic/${q}`
const client = Stomp.overTCP('localhost', 61613)

const errorHandler = (error) => console.error(error)

const connPromise = amqp.connect('amqp://localhost')

// AMQP publisher
async function publish() {
  const conn = await connPromise
  const ch = await conn.createChannel()
  let i = 1
  setInterval(() => {
    console.log(`Sending message ${i}`)
    // To ignore routing key, use for `amp.fanout` exchange.
    ch.publish('amq.topic', q, Buffer.from(`Message ${i++}`))
  }, 1000)
}

// AMQP consumer
async function consume() {
  const conn = await connPromise
  const ch = await conn.createConfirmChannel()
  // Creates an auto-delete queue.
  const queueReply = await ch.assertQueue('', { durable: false, autoDelete: true, exclusive: true })
  console.log(`Auto-delete queue created: ${queueReply.queue}`)
  
  // To ignore routing key, use for `amp.fanout` exchange.
  ch.bindQueue(queueReply.queue, 'amq.topic', q)
  // ch.bindQueue(queueReply.queue, 'amq.topic', '#')
  
  ch.consume(queueReply.queue, (msg) => {
    console.log(`[AMQP] ${msg.content.toString()}`)
    ch.ack(msg)
  })
}

publish()
consume()


// Stomp consumer
client.connect('guest', 'guest', () => {
  // Creates an auto-delete subscription queue of random name bound to `amq.topic` exchange.
  client.subscribe(destination, (message) => {
    console.log(`[STOMP] ${message.body}`)
  })
}, errorHandler)
