# RabbitMQ STOMP

RabbitMQ STOMP / AMQP examples.

## Quick Start

Run RabbitMQ broker.

```sh
# Start RabbitMQ container using docker-compose
npm run rabbitmq
```

### STOMP Publisher

See `stomp` folder.

```sh
# Pub / Sub example
node stomp/pubsub.js

# Queue example
node stomp/queue.js

# AMQ Queue example
node stomp/queue-amq.js
```

### AMQP Publisher

See `amqp` folder.

```sh
# Pub / Sub example
node amqp/pubsub.js

# Pub / Sub example using `fanout` exchange
node amqp/pubsub-fanout.js

# Queue example
node queue.js
```

## Useful References

* [RabbitMQ STOMP Plugin](https://www.rabbitmq.com/stomp.html)
* [RoboMQ](https://robomq.readthedocs.io/en/latest/STOMP/#nodejs)
