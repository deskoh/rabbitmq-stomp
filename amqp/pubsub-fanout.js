// @ts-check
const amqp = require('amqplib')
const Stomp = require('stompjs')

const destination = `/exchange/amq.fanout`
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
    // Routing key ignored for `amp.fanout` exchange.
    ch.publish('amq.fanout', '', Buffer.from(`Message ${i++}`))
  }, 1000)
}

// AMQP consumer
async function consume() {
  const conn = await connPromise
  const ch = await conn.createConfirmChannel()
  // Creates an auto-delete queue.
  const queueReply = await ch.assertQueue('', { durable: false, autoDelete: true, exclusive: true })
  console.log(`Auto-delete queue created: ${queueReply.queue}`)
  
  // Routing key ignored for `amp.fanout` exchange.
  ch.bindQueue(queueReply.queue, 'amq.fanout', '')
  
  ch.consume(queueReply.queue, (msg) => {
    console.log(`[AMQP] ${msg.content.toString()}`)
    ch.ack(msg)
  })
}

publish()
consume()

// Stomp consumer
client.connect('guest', 'guest', () => {
  // Creates an auto-delete subscription queue of random name bound to `amq.fanout` exchange.
  client.subscribe(destination, (message) => {
    console.log(`[STOMP] ${message.body}`)
  })
}, errorHandler)
