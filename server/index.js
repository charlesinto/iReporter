import express from 'express';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import http from 'http';
import path from 'path';
import dotEnv from 'dotenv';
import authRoute from './route/authRoute';
import RedFlagRecords from './route/redFlagRoute';
import interventionRoute from './route/interventionRoute';

dotEnv.config();

const app = express();
app.use(express.static(path.join(__dirname, 'UI')));
app.use(express.static('UI'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/red-flags', RedFlagRecords);
app.use('/api/v1/interventions', interventionRoute);
app.use('/api/v1/auth', authRoute);

app.get('*', (req, res) => {
    res.status(404).send({
        message: 'Route not registered',
    });
});

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socket().listen(server);
io.on('connection', (socket) => {
    console.log(`user connected, id: ${socket.id}`);
});

server.listen(port, () => { console.log(`server is listening on port ${port}`); });

export default server;
