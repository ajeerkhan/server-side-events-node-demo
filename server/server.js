const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 3000;

let clients = [];
let products = [];

function eventsHandler(request, response, next) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
  
    const data = `data: ${JSON.stringify(products)}\n\n`;
  
    response.write(data);
  
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response
    };
  
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
  }
  
  

function sendEventsToAll(products) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(products)}\n\n`))
  }
  
  async function addProduct(request, respsonse, next) {
    const product = request.body;
    products.push(product);
    respsonse.json(product)
    return sendEventsToAll(products);
  }
  
  app.get('/events', eventsHandler);
  app.post('/product', addProduct);

  app.listen(PORT, () => {
    console.log(`Products Events service listening at http://localhost:${PORT}`)
  })
  