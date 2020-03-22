/* global db print */
/* eslint no-restricted-globals: "off" */
/* eslint linebreak-style: ["error", "windows"] */
db.products.remove({});
const productsDB = [
  {
    id: 1,
    category: 'Jeans',
    name: 'Zara',
    price: 250,
    image: 'https://www.zara.com',
  },
  {
    id: 2,
    category: 'Jackets',
    name: 'H&M',
    price: 500,
    image: 'https://www.hm.com',
  },
];
db.products.insertMany(productsDB);
const count = db.products.count();
print('Inserted', count, 'products');
db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });

db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ name: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ image: 1 });
