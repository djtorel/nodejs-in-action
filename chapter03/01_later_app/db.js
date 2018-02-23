// const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const Promise = require('bluebird').Promise;
const dbName = 'later.sqlite';
const dbPromise = sqlite.open(dbName, { Promise });



// sqlite.serialize(() => {
//   const sql = `
//   CREATE TABLE IF NOT EXISTS articles
//     (id integer primary key, title, content TEXT)
//   `;
//   db.run(sql);
// });

class Article {
  async init() {
    try {
      this.db = await dbPromise;
      const sql = `
      CREATE TABLE IF NOT EXISTS articles
        (id integer primary key, title, content TEXT)
      `;
      this.db.run(sql);
    } catch (err) {
      return err;
    }
  }

  async all() {
    return await this.db.all('SELECT * FROM articles');
  }

  async find(id, next) {
    const sql = 'SELECT * FROM articles WHERE id = ?';
    const article = await this.db.get(sql, id);
    if (article) {
      return article;
    } else {
      const err = new Error('Not Found');
      err.status = 404;
      return  next(err);
    }
  }

  async create(data) {
    const sql = 'INSERT INTO articles(title, content) VALUES (?, ?)';
    await this.db.run(sql, data.title, data.content);
  }

  async delete(id, next) {
    try {
      if (!id) {
        return next(new Error('Please provide an id'));
      }
      await this.db.run('DELETE FROM articles WHERE id = ?', id);
    } catch (err) {
      return next(err);
    }
  }

  async run(sql) {
    await this.db.run(sql);
  }
}

module.exports = { Article };