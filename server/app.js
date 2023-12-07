var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var todoRouter = require('./routes/todo');
var postRouter = require('./routes/post');
var commentRouter = require('./routes/comment');
var albumRouter = require('./routes/album');
var photoRouter = require('./routes/photo');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/todo', todoRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/album', albumRouter);
app.use('/photo', photoRouter);

module.exports = app;
