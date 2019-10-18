// @ts-check
const amqp = require('amqplib')
const Stomp = require('stompjs')

const q = 'tasks'
// Following destinations are equivalent
const destination = `/queue/${q}`
// const destination = `/exchange/amq.topic/${q}`
const client = Stomp.overTCP('localhost', 61613)

const errorHandler = (error) => console.error(error)

const connPromise = amqp.connect('amqp://localhost')

// AMQP publisher
async function publish() {
  const conn = await connPromise
  const ch = await conn.createChannel()
  // Queue has to match properties created by STOMP subscription
  await ch.assertQueue(q, { durable: true, autoDelete: false })

  let i = 1
  setInterval(() => {
    console.log(`Sending message ${i}`)
    ch.sendToQueue(q, Buffer.from(`Message ${i++}`))
  }, 1000)
}

// AMQP consumer
async function consume() {
  const conn = await connPromise
  const ch = await conn.createChannel()
  // Queue has to match properties created by STOMP subscription
  await ch.assertQueue(q, { durable: true, autoDelete: false })
  ch.consume(q, (msg) => {
    console.log(`[AMQP] ${msg.content.toString()}`)
    ch.ack(msg)
  })
}

publish()
consume()

// Stomp consumer
client.connect('guest', 'guest', () => {
  // Creates an durable queue `tasks`
  client.subscribe(destination, (message) => {
    console.log(`[STOMP] ${message.body}`)
  })
}, errorHandler)
