# RabbitMQ STOMP

RabbitMQ STOMP / AMQP test.

## Quick Start

```sh
# Start RabbitMQ container using docker-compose
npm run rabbitmq

# Pub / Sub test
node pubsub.js

# Queue test
node queue.js

# AMQ Queue test
# Known issue: Queue will build up for STOMP subscription.
node queue-amq.js
```