const join = require('path').join;
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');
const http = require('http').Server(app);
const io = require('socket.io')(http, { serveClient: false });

const TIMEOUT = 60000;

// Twitch config.

let twitchFeed;

const updateFeed = () => {
  request.get('https://api.twitch.tv/kraken/beta/streams/random?client_id=abc', (err, res, body) => {
    console.log('Updating twitch feed');
    twitchFeed = body;
  });
};

updateFeed();
setInterval(updateFeed, TIMEOUT);

// Web server config.

let ships = [],
  index = 0;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));

app.get('/', (req, res) => {
  return res.sendFile(join(__dirname, 'build', 'index.html'));
});

app.get('/api/ships', (req, res) => {
  return res.send(ships);
});

app.get('/api/twitch-feed', (req, res) => {
  return res.send(twitchFeed);
});

app.post('/api/ships', (req, res) => {
  let ship = req.body;
  ship.index = index++;

  if (ships.find(s => s.name === ship.name)) {
    console.log(`Ship "${ship.name}" already exists`);
    return res.sendStatus(400);
  }

  console.log(`Adding ship "${ship.name}"`);
  ships.push(ship);
  createNamespace(ship.name);
  res.send(ship);
});

app.listen(3003, () => {
  console.log('App server listening on port 3003');
});

// Websocket server config.

const createNamespace = (name) => {
  const nsp = io.of(`/${name}`);
  const messages = [];
  nsp.on('connection', (socket) => {
    socket.on('chat', (msg) => {
      messages.push(msg);
      console.log('Chat message: ', msg);
      nsp.emit('chat', msg);
    });

    // Send convo history upon connecting.
    socket.emit('init', messages);
  });

  setInterval(() => {
    console.log(`Changing the channel on ship "${name}"`);
    nsp.emit('change_channel', twitchFeed);
  }, TIMEOUT);
};

http.listen(3004, () => {
  console.log('Websocket server listening on port 3004');
});
