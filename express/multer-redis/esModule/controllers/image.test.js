jest.mock('../utils/redis/index');
import { uploadImage, getImage } from './image.js';
import redisClient from '../utils/redis/index';


describe('uploadImage 테스트', () => {
  const req = {
    file: {
      buffer: Buffer.from('test'),
    },
    body: {
      roomId: "abc123",
      type: "ATTACK"
    }
  };
  const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    test('이미지 저장 시 이미지 아이디 반환', async () => {
      await uploadImage(req, res);
  
      // expect(redisClient.set).toHaveBeenCalledWith(imageId, expect.any(String));
      expect(res.send).toHaveBeenCalledWith({ status: 201, roomId: "abc123" });
    });
  test('이미지 저장에 실패하면 이미지 저장 실패 메시지 반환', async () => {
    redisClient.set.mockRejectedValueOnce(new Error());

    await uploadImage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      status: 500,
      message: '이미지 저장에 실패했습니다.',
    });
  });
});

describe('getImage 테스트', () => {
  const req = {
      params: {
        roomId: 'testImageId',
      },
    };
  const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      writeHead: jest.fn(),
      end: jest.fn(),
    };

  test('이미지 가져오기 성공', async () => {
    // 이미지를 base64 문자열 형태로 변환
    const imgBase64 = Buffer.from('testImageId').toString('base64');
    redisClient.get.mockResolvedValue(JSON.stringify({
      attack: imgBase64
    }));

    await getImage(req, res);

    // base64 문자열을 버퍼로 변경
    const imgBuffer = Buffer.from(imgBase64, 'base64');
    expect(redisClient.get).toHaveBeenCalledWith('testImageId');
    expect(res.writeHead).toHaveBeenCalledWith(200, {
      'Content-Type': 'image/png',
      'Content-Length': imgBuffer.length,
    });
    expect(res.end).toHaveBeenCalledWith(imgBuffer);
  });

  test('이미지 아이디를 찾을 수 없음', async () => {
    // null 반환
    redisClient.get.mockResolvedValue(JSON.stringify({}));

    await getImage(req, res);

    expect(redisClient.get).toHaveBeenCalledWith('testImageId');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      status: 404,
      message: '이미지를 찾을 수 없습니다.',
    });
  });

  it('레디스 내부 오류 발생', async () => {
    redisClient.get.mockRejectedValueOnce(new Error());

    await getImage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      status: 500,
      message: '이미지를 가져오는데 실패했습니다.',
    });
  });
});
