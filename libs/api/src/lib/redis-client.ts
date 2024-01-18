import type { RedisClientType } from 'redis';
import { createClient } from 'redis';

const redisUrl = `redis://localhost:6379`;
const redisClient: RedisClientType = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('? Redis client connected...');
    redisClient.set(
      'tRPC',
      '??Welcome to tRPC with React.js, Express and Typescript!',
    );
  } catch (error: any) {
    console.log(error.message);
    // exit(1);
  }
};

connectRedis();

redisClient.on('error', (err) => console.log(err));

export { redisClient };
