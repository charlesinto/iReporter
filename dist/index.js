'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _getRedFlagRecords = require('./route/getRedFlagRecords');

var _getRedFlagRecords2 = _interopRequireDefault(_getRedFlagRecords);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var apiVersion = _express2.default.Router();
var app = (0, _express2.default)();
app.use(_express2.default.static(_path2.default.join(__dirname, 'UI')));
app.use(_express2.default.static('UI'));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use('/api/v1/red-flags', _getRedFlagRecords2.default);

var port = process.env.PORT || 5000;
var server = _http2.default.createServer(app);
var io = (0, _socket2.default)().listen(server);
io.on('connection', function (socket) {
    console.log('user connected, id: ' + socket.id);
});

server.listen(port, function () {
    console.log('server is listening on port ' + port);
});

exports.default = server;