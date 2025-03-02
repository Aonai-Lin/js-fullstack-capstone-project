const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/app', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(9000);

// build文件为giftlink-frontend的构建后的产物
// 将 build 文件夹作为静态资源目录，提供前端文件。
// 对于根路径 / 和 /app，返回 index.html 文件，以支持单页应用的路由功能。
// 启动服务器，监听端口 9000。