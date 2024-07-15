import { Readable } from 'stream';
import redisClient from '../utils/redis/index.js';

export const uploadImage = async (req, res) => {
  const imgBuffer = req.file.buffer;
  const imageId = Date.now().toString(); // 이미지 ID 생성 (예: 타임스탬프)
  const imgBase64 = imgBuffer.toString('base64'); // Buffer를 Base64 문자열로 변환

  try {
      await redisClient.set(imageId, imgBase64);
      res.send({ imageId });
  } catch (err) {
      res.status(500).send('Error saving image to Redis');
  }
}

export const getImage = async (req, res) => {
  const imageId = req.params.id;
  try {
      const imgBase64 = await redisClient.get(imageId);
      if (!imgBase64) {
          return res.status(404).send('Image not found');
      }

      const imgBuffer = Buffer.from(imgBase64, 'base64'); // Base64 문자열을 Buffer로 변환

      res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': imgBuffer.length
      });
      res.end(imgBuffer);
  } catch (err) {
      res.status(500).send('Error retrieving image from Redis');
  }
}

