import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { PostsModule } from '../src/posts/posts.module';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as request from 'supertest';

describe('Posts', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const users = [
    {
      id: uuidv4(),
      email: 'a@gmail.com',
      name: 'A',
      password: '123',
    },
    {
      id: uuidv4(),
      email: 'b@gmail.com',
      name: 'B',
      password: '1234',
    },
  ];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PostsModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    await app.init();

    for (const user of users) {
      await prismaService.user.create({ data: user });
    }
  });

  afterEach(async () => {
    await prismaService.post.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prismaService.user.deleteMany();
  });

  describe('GET /posts', () => {
    it('should return an array of posts', async () => {
      const postsData: Prisma.PostCreateManyInput[] = [
        {
          id: uuidv4(),
          title: 'Test Post 1',
          content: 'Lorem ipsum dolor sit amet.',
          authorId: users[0].id,
        },
        {
          id: uuidv4(),
          title: 'Test Post 2',
          content: 'Lorem ipsum dolor sit amet.',
          authorId: users[1].id,
        },
      ];

      await prismaService.post.createMany({ data: postsData });

      return request(app.getHttpServer())
        .get('/posts')
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(postsData);
        });
    });
  });

  describe('POST /posts', () => {
    it('should return a post', async () => {
      const postData: Prisma.PostCreateInput = {
        id: uuidv4(),
        title: 'Test Post',
        content: 'Lorem ipsum dolor sit amet.',
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

      return request(app.getHttpServer())
        .post('/posts')
        .send(postData)
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject(expectedPost);
        });
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a post by id', async () => {
      const postsData: Prisma.PostCreateManyInput[] = [
        {
          id: uuidv4(),
          title: 'Test Post 1',
          content: 'Lorem ipsum dolor sit amet.',
          authorId: users[0].id,
        },
        {
          id: uuidv4(),
          title: 'Test Post 2',
          content: 'Lorem ipsum dolor sit amet.',
          authorId: users[1].id,
        },
      ];

      for (const postData of postsData) {
        await prismaService.post.createMany({ data: postData });
      }

      return request(app.getHttpServer())
        .get(`/posts/` + postsData[0].id)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(postsData[0]);
        });
    });
  });

  describe('PATCH /posts/:id', () => {
    it('should return a post by id', async () => {
      const postsData: Prisma.PostCreateManyInput[] = [
        {
          id: uuidv4(),
          title: 'Test Post 1',
          content: 'Lorem ipsum dolor sit amet.',
          authorId: users[0].id,
        },
        {
          id: uuidv4(),
          title: 'Test Post 2',
          content: 'Lorem ipsum dolor sit amet.',
          authorId: users[1].id,
        },
      ];

      for (const postData of postsData) {
        await prismaService.post.createMany({ data: postData });
      }

      const postData: Prisma.PostUpdateInput = {
        title: 'Updated Post',
      };

      return request(app.getHttpServer())
        .patch(`/posts/` + postsData[0].id)
        .send(postData)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({ ...postsData[0], ...postData });
        });
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should return a post by id', async () => {
      const postsData: Prisma.PostCreateManyInput[] = [
        {
          id: uuidv4(),
          title: 'Test Post 1',
          content: 'Lorem ipsum dolor sit amet.',
          authorId: users[0].id,
        },
        {
          id: uuidv4(),
          title: 'Test Post 2',
          content: 'Lorem ipsum dolor sit amet.',
          authorId: users[1].id,
        },
      ];

      for (const postData of postsData) {
        await prismaService.post.createMany({ data: postData });
      }

      return request(app.getHttpServer())
        .delete(`/posts/` + postsData[0].id)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(postsData[0]);
        });
    });
  });
});
