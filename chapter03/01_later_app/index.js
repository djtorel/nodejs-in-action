const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const read = require('node-readability');

const Article = require('./db').Article;

const app = express();
app.use(morgan('dev'));
app.set('port', process.env.PORT || 3000);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/articles', async (req, res, next) => {
  try {
    await Article.all((err, articles) => {
      if (err) {
        return err;
      }
      res.send(articles);
    });
  } catch (err) {
    return next(err);
  }
});

app.post('/articles', async (req, res, next) => {
  try {
    const url = req.body.url;
    await read(url, async (err, result) => {
      try {
        if (!result) {
          const err = new Error('Error downloading article');
          err.status = 500;
          return next(err);
        }
        await Article.create({ title: result.title, content: result.content });
        res.send('OK');
      } catch (err) {
        return next(err);
      }
    });
  } catch (err) {
    return next(err);
  }
});

app.get('/articles/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await Article.find(id);
    res.send(article);
  } catch (err) {
    return next(err);
  }
});

app.delete('/articles/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await Article.delete(id);
    res.send({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
});

app.listen(app.get('port'), () => {
  console.log(`App started on port ${app.get('port')}`);
});

module.exports = { app };