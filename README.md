
# Master-Slave Monitoring System

This project implements a master-slave monitoring system in Node.js, where a master server maintains persistent connections to multiple slave servers, monitoring their heartbeat to check if they are alive. The master server logs the status of each connected slave and records when a slave connects, disconnects, or becomes unresponsive.

## Project Structure

```
master-slave-monitoring
├── master
│   ├── index.js              # Master server entry point
│   └── config.js             # Master server configuration
├── slave
│   ├── index.js              # Slave server entry point
│   └── config.js             # Slave server configuration
├── logs
│   └── master.log            # Log file for master server
└── package.json    
```

## Features

- **Persistent Connection**: Slave servers maintain a persistent WebSocket connection to the master server.
- **Heartbeat Monitoring**: Each slave sends a periodic "heartbeat" message to the master to indicate it's alive.
- **Unresponsive Detection**: The master tracks the time since the last heartbeat from each slave and logs if a slave becomes unresponsive.
- **Dynamic Slave Addition/Removal**: New slave servers can be added or removed dynamically, with real-time updates on their status.
- **Logging**: Logs are maintained for each connection, disconnection, and unresponsive status of slaves.

## Configuration

### Master Configuration (in `master/config.js`)
- **MASTER_PORT**: Port for the master server (default: `8080`)
- **HEARTBEAT_INTERVAL**: Time in milliseconds before the master marks a slave as "unresponsive" if no heartbeat is received (e.g., `7000`).
- **CHECK_INTERVAL**: Interval (in ms) for the master to check the heartbeat status of slaves.

### Slave Configuration (in `slave/config.js`)
- **MASTER_URL**: URL of the master server (e.g., `ws://localhost:8080`).
- **HEARTBEAT_INTERVAL**: Interval (in ms) for the slave to send heartbeat messages to the master (e.g., `3000`).

## Usage

### 1. Start the Master Server

To start the master server, run:

```bash
node master/index.js
```

The master server will listen for connections on the configured port. Logs will be stored in the `logs/master.log` file.

### 2. Start Slave Servers

Open a new terminal for each slave instance and run:

```bash
node slave/index.js
```

Each slave will connect to the master and start sending periodic heartbeat messages. You can start as many slave instances as desired.
