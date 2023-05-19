import dotenv from 'dotenv';

dotenv.config();
export default {
  mongoUrl:
    process.env.MONGO_URL || 'mongodb+srv://viniciushrcs:YDsTnEy6Jai6y0rp@chainlink-hackathon.kxuqjhi.mongodb.net',
  port: process.env.PORT || 3000,
};
