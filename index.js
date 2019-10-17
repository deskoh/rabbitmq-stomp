// @ts-check
const amqp = require('amqplib')

const q = 'tasks'

const connPromise = amqp.connect('amqp://localhost')

// Publisher
async function publish() {
  try {
    const conn = await connPromise
    const ch = await conn.createChannel()
    await ch.assertQueue(q)
    ch.sendToQueue(q, Buffer.from('something to do'))
  } catch (error) {
    console.error(error)
  }
}

// Consumer
async function consume() {
  const conn = await connPromise
  const ch = await conn.createChannel()
  await ch.assertQueue(q)
  ch.consume(q, (msg) => {
    if (msg !== null) {
      console.log(msg.content.toString())
      ch.ack(msg)
    }
  })
}

publish()
consume()
