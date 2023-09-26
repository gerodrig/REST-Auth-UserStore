import mongoose from 'mongoose';

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: Options): Promise<boolean> {
    const { mongoUrl, dbName } = options;
    try {
      await mongoose.connect(mongoUrl, {
        dbName,
      });

      console.log(`Connected to MongoDB: ${mongoUrl}`);
      return true;
    } catch (error) {
      console.log(`Error connecting to MongoDB: ${error}`);
      throw error;
    }
  }
}
