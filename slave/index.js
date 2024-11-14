const WebSocket = require('ws');
const { MASTER_URL, HEARTBEAT_INTERVAL } = require('./config');

function connectToMaster() {
    const ws = new WebSocket(MASTER_URL);

    ws.on('open', () => {
        console.log('Connected to master server');
        sendHeartbeat(ws);
    });

    ws.on('close', () => {
        console.log('Disconnected from master server. Reconnecting...');
        setTimeout(connectToMaster, 1000);
    });

    ws.on('error', (error) => {
        console.error(`Connection error: ${error.message}`);
    });

    function sendHeartbeat(ws) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send('heartbeat');
            console.log('Heartbeat sent to master at', new Date().toISOString());
        }
        setTimeout(() => sendHeartbeat(ws), HEARTBEAT_INTERVAL);
    }
    
}

connectToMaster();
