const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const uuid = require('uuid');

const tickets = [];

const app = new Koa();

app.use(cors('Access-Control-Allow-Origin', '*'));

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use(async ctx => {
  const { method, id } = ctx.request.query;
  
  switch (method) {
      case 'allTickets':
        const allTickets = [];
        for(let i = 0; i < tickets.length; i += 1) {
          const { description, ...short } = tickets[i];
          allTickets.push(short);
        }
        
        ctx.response.body = JSON.stringify(allTickets);
        ctx.response.status = 200;
        return;
      
      case 'ticketById':
        const ticket = tickets.find((el) => el.id === id);
      
        ctx.response.body = JSON.stringify(ticket);
        ctx.response.status = 200;
        return;

      case 'createTicket':
        const ticketNew = ctx.request.body;
        ticketNew.id = uuid.v4();
        tickets.push(ticketNew);

        ctx.response.status = 200;
        return;

      case 'toggleStatus':
        const idToggle = JSON.parse(ctx.request.body);
        tickets.map((t) => {
          if (t.id === idToggle) {
            t.status = t.status === true ? false : true;
          }
        });

        ctx.response.status = 200;
        return;
      
      case 'editTicket':
        const ticketEdit = ctx.request.body;
        tickets.map((t) => {
          if (t.id === ticketEdit.id) {
            t.name = ticketEdit.name;
            t.description = ticketEdit.description;
          }
        });
        ctx.response.status = 200;
        return;
      
      case 'deleteTicket':
        const index = tickets.findIndex((t) => t.id === id);
        tickets.splice(index, 1);

        ctx.response.status = 200;
        return;

      default:
          ctx.response.status = 404;
          return;
  }
});

const server = http.createServer(app.callback());
const port = 7000;

server.listen(port, (err) => {
  if (err) {
    return console.log('Error occured:', err)
  }
  console.log(`server is listening on ${port}`)
});