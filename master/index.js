const WebSocket = require('ws');
const moment = require('moment');
const fs = require('fs');
const { MASTER_PORT, HEARTBEAT_INTERVAL, CHECK_INTERVAL } = require('./config');

const server = new WebSocket.Server({ port: MASTER_PORT });
const slaves = new Map();

const logFile = './logs/master.log';

function logMessage(message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const logEntry = `[${timestamp}] ${message}\n`;
    console.log(logEntry.trim());
    fs.appendFileSync(logFile, logEntry);
}

server.on('connection', (ws, req) => {
    const slaveId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
    logMessage(`Slave connected: ${slaveId}`);
    slaves.set(slaveId, Date.now());

    ws.on('message', (message) => {
      if (message.toString() === 'heartbeat') {
          slaves.set(slaveId, Date.now());
          logMessage(`Updated heartbeat from ${slaveId} at ${moment().format('HH:mm:ss')}`);
      }
  });
  

    ws.on('close', () => {
        logMessage(`Slave disconnected: ${slaveId}`);
        slaves.delete(slaveId);
    });

    ws.on('error', (error) => {
        logMessage(`Error with slave ${slaveId}: ${error.message}`);
    });
});

setInterval(() => {
  const now = Date.now();
  slaves.forEach((lastHeartbeat, slaveId) => {
      const timeSinceLastHeartbeat = now - lastHeartbeat;

      if (timeSinceLastHeartbeat > HEARTBEAT_INTERVAL) {
          logMessage(`Slave ${slaveId} is unresponsive (dead)`);
          slaves.delete(slaveId);
      }
  });
}, CHECK_INTERVAL);


logMessage(`Master server started on port ${MASTER_PORT}`);
