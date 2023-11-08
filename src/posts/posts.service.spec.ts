import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;
  let usersService: UsersService;
  const users = [
    {
      id: uuidv4(),
      email: 'a@gmail.com',
      name: 'Test User',
      password: 'password',
    },
    {
      id: uuidv4(),
      email: 'b@gmail.com',
      name: 'Test User',
      password: 'password',
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, PrismaService, UsersService],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);

    for (const user of users) {
      await usersService.create(user);
    }
  });

  afterEach(async () => {
    // Clean up the test database after each test
    await prismaService.post.deleteMany({});
  });

  afterAll(async () => {
    // Close the Prisma client after all tests
    await prismaService.$disconnect();
    await prismaService.user.deleteMany({});
  });

  describe('create', () => {
    it('should create a post', async () => {
      const postData: Prisma.PostCreateInput = {
        id: uuidv4(),
        title: 'Test Post',
        content: 'Test Post Content',
        author: {
          connect: {
            id: users[0].id,
          },
        },
      };
      const expectedPost = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        authorId: users[0].id,
      };

      const createdPost = await service.create(postData);

      expect(createdPost).toMatchObject(expectedPost);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const postData: Prisma.PostCreateManyInput[] = [
        {
          id: uuidv4(),
          title: 'Test Post 1',
          content: 'Test Post Content 1',
          authorId: users[0].id,
        },
        {
          id: uuidv4(),
          title: 'Test Post 2',
          content: 'Test Post Content 2',
          authorId: users[1].id,
        },
      ];

      await prismaService.post.createMany({ data: postData });

      const posts = await service.findAll({});

      expect(posts).toHaveLength(2);

      expect(posts).toMatchObject(postData);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const postData: Prisma.PostCreateInput = {
        id: uuidv4(),
        title: 'Test Post',
        content: 'Test Post Content',
        author: {
          connect: {
            id: users[0].id,
          },
        },
      };
      const expectedPost = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        authorId: users[0].id,
      };

      const createdPost = await prismaService.post.create({ data: postData });

      const foundPost = await service.findOne({ id: createdPost.id });

      expect(foundPost).toMatchObject(expectedPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postData: Prisma.PostCreateInput = {
        id: uuidv4(),
        title: 'Test Post',
        content: 'Test Post Content',
        author: {
          connect: {
            id: users[0].id,
          },
        },
      };
      const updatedPostData: Prisma.PostUpdateInput = {
        title: 'Updated Test Post',
        content: 'Updated Test Post Content',
      };

      const createdPost = await prismaService.post.create({ data: postData });

      const updatedPost = await service.update({
        where: { id: createdPost.id },
        data: updatedPostData,
      });

      expect(updatedPost).toMatchObject(updatedPostData);

      const foundPost = await prismaService.post.findUnique({
        where: { id: createdPost.id },
      });

      expect(foundPost).toMatchObject(updatedPostData);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const postData: Prisma.PostCreateInput = {
        id: uuidv4(),
        title: 'Test Post',
        content: 'Test Post Content',
        author: {
          connect: {
            id: users[0].id,
          },
        },
      };

      const createdPost = await prismaService.post.create({ data: postData });

      const deletedPost = await service.remove({ id: createdPost.id });

      expect(deletedPost).toMatchObject(createdPost);

      const foundPost = await prismaService.post.findUnique({
        where: { id: createdPost.id },
      });

      expect(foundPost).toBeNull();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
