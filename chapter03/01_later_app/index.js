const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const read = require('node-readability');

const Article = require('./db').Article;
const db = new Article();
// init db
db.init();

// Set up express and morgan for logging
const app = express();
const PORT = process.env.PORT || 3030;
app.use(morgan('dev'));

// Set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static content
app.use(
  '/css/bootstrap.css',
  express.static('./node_modules/bootstrap/dist/css/bootstrap.min.css')
);

// GET /articles
// Retrieve all articles from database
app.get('/articles', async (req, res, next) => {
  try {
    const articles = await db.all();
    res.format({
      html: () => {
        res.render('articles.ejs', { articles });
      },
      json: () => {
        res.json(articles);
      }
    });
  } catch (err) {
    return next(err);
  }
});

// POST /articles
// Look for an article supplied by a url object in body, and stor readable
// version in database
app.post('/articles', async (req, res, next) => {
  try {
    const url = req.body.url;
    await read(url, async (err, result) => {
      if (!result) {
        const err = new Error('Error downloading article');
        err.status = 500;
        return next(err);
      }
      await db.create({ title: result.title, content: result.content });
      res.json({ status: 'Article saved' });
    });
  } catch (err) {
    return next(err);
  }
});

// GET /articles/:id
// Look for a specific article
app.get('/articles/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await db.find(id, next);
    res.json(article);
  } catch (err) {
    return next(err);
  }
});

// DELETE /articles/:id
// Handles deleting an article from database
app.delete('/articles/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await db.delete(id);
    res.send({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
});

// Handle 404 Not Found
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  return next(err);
});

// Handle other errors
app.use((err, req, res, next) => { //eslint-disable-line no-unused-vars
  if (!err.status) {
    const error = new Error(`Internal Server error: ${err.message}`);
    error.status = 500;
    return res.json({ error });
  }
  const error = {
    status: err.status,
    message: err.message,
  };
  return res.json({ error });
});

// Start server
app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});

module.exports = { app };