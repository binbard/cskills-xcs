const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let qna = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('init', qna);

  socket.on('qna', (data) => {
    console.log(`question: ${data.question} | answer: ${data.answer} | name: ${data.name}`);
    if (data.name === '!1') {
      qna = [];
      io.emit('clear qna');
    }
    else if (data.name === '!2') {
      io.emit('clear all');
    }
    else if (data.name === '!3') {
      qna = [];
      io.emit('clear del all');
    } else {
      qna.push({ question: data.question, answer: data.answer, name: data.name });
      io.emit('new qna', { question: data.question, answer: data.answer, name: data.name });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(80, () => {
  console.log('listening on *:80');
});
