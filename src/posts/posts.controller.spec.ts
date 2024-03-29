import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { faker } from '@faker-js/faker';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService, PrismaService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  afterAll(async () => {
    jest.resetModules();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const postData = {
        id: uuidv4(),
        title: faker.lorem.words(3),
        content: faker.lorem.words(10),
        author: {
          connect: {
            id: uuidv4(),
          },
        },
      };

      const mockedValue = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        authorId: postData.author.connect.id,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockedValue);

      const result = await controller.create(postData);

      expect(result).toBe(mockedValue);
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const postData = [
        {
          id: uuidv4(),
          title: faker.lorem.words(3),
          content: faker.lorem.words(10),
          authorId: {
            connect: {
              id: uuidv4(),
            },
          },
        },
        {
          id: uuidv4(),
          title: faker.lorem.words(3),
          content: faker.lorem.words(10),
          authorId: {
            connect: {
              id: uuidv4(),
            },
          },
        },
      ];

      const mockedValue = [
        {
          id: postData[0].id,
          title: postData[0].title,
          content: postData[0].content,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
          authorId: postData[0].authorId.connect.id,
        },
        {
          id: postData[1].id,
          title: postData[1].title,
          content: postData[1].content,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
          authorId: postData[1].authorId.connect.id,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockedValue);

      const result = await controller.findAll();

      expect(result).toBe(mockedValue);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const postData = {
        id: uuidv4(),
        title: faker.lorem.words(3),
        content: faker.lorem.words(10),
        authorId: {
          connect: {
            id: uuidv4(),
          },
        },
      };

      const mockedValue = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        authorId: postData.authorId.connect.id,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockedValue);

      const result = await controller.findOne(postData.id);

      expect(result).toBe(mockedValue);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postData = {
        id: uuidv4(),
        title: faker.lorem.words(3),
        content: faker.lorem.words(10),
        updatedAt: faker.date.recent(),
        authorId: {
          connect: {
            id: uuidv4(),
          },
        },
      };

      const mockedValue = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        createdAt: faker.date.past(),
        updatedAt: postData.updatedAt,
        authorId: postData.authorId.connect.id,
      };

      jest.spyOn(service, 'update').mockResolvedValue(mockedValue);

      const result = await controller.update(postData.id, postData);

      expect(result).toBe(mockedValue);
    });
  });

  describe('remove', () => {
    it('should remove a post by id', async () => {
      const postData = {
        id: uuidv4(),
        title: faker.lorem.words(3),
        content: faker.lorem.words(10),
        authorId: {
          connect: {
            id: uuidv4(),
          },
        },
      };

      const mockedValue = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        authorId: postData.authorId.connect.id,
      };

      jest.spyOn(service, 'remove').mockResolvedValue(mockedValue);

      const result = await controller.remove(postData.id);

      expect(result).toBe(mockedValue);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
