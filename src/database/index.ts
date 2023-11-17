import mongoose, { ConnectOptions } from 'mongoose';

const options: ConnectOptions = {};
const connect = async () => {
  if (!process.env.DB_HOST) throw new Error('no db host');

  const db = await mongoose.connect(process.env.DB_HOST, options).catch(console.error);
  console.log('Database Connected...');
  return db;
};

const Database = {
  connect,
};

export default Database;
