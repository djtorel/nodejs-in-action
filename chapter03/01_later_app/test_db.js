const sqlite = require('sqlite');
const Promise = require('bluebird').Promise;

const dbPromise = sqlite.open('./test_db.sqlite', { Promise });

async function deleteAll(db) {
  const sql = 'DELETE FROM test';
  await db.run(sql);
}

async function deleteRow(id, db) {
  if (!id) return new Error('Please provide an id');
  db.run('DELETE FROM test WHERE id = ?', id);
}

async function find(id, db) {
  return await db.get('SELECT * FROM test WHERE id = ?', id);
}
async function create(data, db) {
  const sql = 'INSERT INTO test(title, content) VALUES (?, ?)';
  await db.run(sql, data.title, data.content);
}

async function all(db) {
  return await db.all('SELECT * FROM test');
}

async function main() {
  try {
    const db = await dbPromise;
    let sql = `
    CREATE TABLE IF NOT EXISTS test
      (id integer primary key, title, content TEXT)
    `;
  
    await db.run(sql);
    await deleteAll(db);

    const testObj = {
      title: 'foo',
      content: 'bar',
    };
    await create(testObj, db);

    const testCreate = await all(db);

    console.log('Verifying create works:');
    console.dir(testCreate);

    await deleteRow(1, db);
    const testDelete = await all(db);
    console.log('Verifying delete works');
    console.dir(testDelete);

    await create({ title: 'Hello', content: 'Kitty' }, db);
    await create({ title: 'Barry', content: 'Bonds' }, db);
    await create({ title: 'Dead', content: 'Pool' }, db);

    console.log('Should be 3 articles');
    console.dir(await all(db));

    console.log('Should find id 2');
    console.dir(await find(2, db));

  } catch (err) {
    console.error(err.message);
  }

}

main();