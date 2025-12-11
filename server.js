const path = require('path');
const express = require('express');
const compress = require('compression');

const app = express();

const port = 3001;
app.use(compress());
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});
