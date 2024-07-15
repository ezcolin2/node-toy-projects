import redis from "redis";

// Redis 클라이언트 설정
const redisClient = redis.createClient();
redisClient.connect();
redisClient.on("connect", () => {
  console.log("redis 연결 성공");
});

redisClient.on("error", (err) => {
  console.error(err);
});

export default redisClient;