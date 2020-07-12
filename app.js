const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const worker = createWorker({ logger: (m) => console.log(m) });

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, './uploads');
  },
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single('avatar');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    fs.readFile(`./uploads/${req.file.originalname}`, (err, res) => {
      if (err) return console.log('this is your error', err);
      worker.recognize();
    });
  });
});
const POST = 5000 | process.env.PORT;
app.listen(POST, () => console.log(`listening port: 5000`));
