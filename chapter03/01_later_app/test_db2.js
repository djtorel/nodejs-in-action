const Article = require('./db').Article;


async function main() {
  const db = await new Article();
  try {
    await db.init();
    await db.run('DELETE FROM articles');
    await db.create({ title: 'Hello', content: 'Kitty' });
    await console.log(await db.all());
    await db.run('DELETE FROM articles');
  } catch (err) {
    console.error(err);
  }
}


main();