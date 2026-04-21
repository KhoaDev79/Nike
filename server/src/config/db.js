import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT_URL);
    console.log('Connect database success');
  } catch (error) {
    console.log('Connect database error!');
    process.exit(1);
  }
};
