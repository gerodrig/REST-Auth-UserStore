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

  static async disconnect(): Promise<boolean> {
    try {
      await mongoose.connection.close();
      console.log('Disconnected from MongoDB');
      return true;
    } catch (error) {
      console.log(`Error disconnecting from MongoDB: ${error}`);
      throw error;
    }
  }
}
