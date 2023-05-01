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
        } else {
            qna.push({ question: data.question, answer: data.answer, name: data.name });
            io.emit('new qna', { question: data.question, answer: data.answer, name: data.name });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
