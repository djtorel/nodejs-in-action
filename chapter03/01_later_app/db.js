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
  static async all() {
    return await db.all('SELECT * FROM articles', cb);
  }

  static find(id) {
    db.get('SELECT * FROM articles WHERE id = ?', id, cb);
  }

  static create(data, cb) {
    const sql = 'INSERT INTO articles(title, content) VALUES (?, ?)';
    db.run(sql, data.title, data.content, cb);
  }

  static delete(id, cb) {
    if (!id) return cb(new Error('Please provide an id'));
    db.run('DELETE FROM articles WHERE id = ?', id, cb);
  }
}

module.exports = { db, Article };