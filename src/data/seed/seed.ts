import { envs } from '../../config';
import { MongoDatabase } from '../mongo/mongo-database';
import { UserModel, CategoryModel, ProductModel } from '../mongo/models';
import { seedData } from './data';

(async () => {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  await main();

  await MongoDatabase.disconnect();
})();

const randomBetween0andX = (x: number) => Math.floor(Math.random() * x);

async function main() {
  //! Delete all data from database
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  //? create users
  const users = await UserModel.insertMany(seedData.users);

  //? create categories
  const categories = await CategoryModel.insertMany(
    seedData.categories.map((category) => ({
      ...category,
      user: users[randomBetween0andX(users.length)].id,
    }))
  );

  //? create products
  const products = await ProductModel.insertMany(
    seedData.products.map((product) => ({
      ...product,
      user: users[randomBetween0andX(users.length)].id,
      category: categories[randomBetween0andX(categories.length)].id,
    }))
  );

  console.log('Seed finished');
}
