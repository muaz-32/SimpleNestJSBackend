import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

describe('Users', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prismaService.user.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: uuidv4(),
          email: 'c@gmail.com',
          name: 'A',
          password: '123',
        },
        {
          id: uuidv4(),
          email: 'd@gmail.com',
          name: 'B',
          password: '1234',
        },
      ];
      for (const user of users) {
        await prismaService.user.createMany({ data: user });
      }
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(users);
    });
  });

  describe('POST /users', () => {
    it('should return a user', () => {
      const user: Prisma.UserCreateInput = {
        id: uuidv4(),
        email: 'test@gmail.com',
        name: 'Test User',
        password: 'password',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201)
        .expect(user);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const users = [
        {
          id: uuidv4(),
          email: 'f@gmail.com',
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
      for (const user of users) {
        await prismaService.user.createMany({ data: user });
      }
      return request(app.getHttpServer())
        .get('/users/' + users[0].id)
        .expect(200)
        .expect(users[0]);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should return a user by id', async () => {
      const users = [
        {
          id: uuidv4(),
          email: 'g@gmail.com',
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
      for (const user of users) {
        await prismaService.user.createMany({ data: user });
      }
      const modifiedUser = users[0];
      modifiedUser.name = 'Updated User';
      return request(app.getHttpServer())
        .patch('/users/' + users[0].id)
        .send({
          name: 'Updated User',
        })
        .expect(200)
        .expect(modifiedUser);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return a user by id', async () => {
      const users = [
        {
          id: uuidv4(),
          email: 'h@gmail.com',
          name: 'A',
          password: '123',
        },
        {
          id: uuidv4(),
          email: 'i@gmail.com',
          name: 'B',
          password: '1234',
        },
      ];
      for (const user of users) {
        await prismaService.user.createMany({ data: user });
      }
      return request(app.getHttpServer())
        .delete('/users/' + users[0].id)
        .expect(200)
        .expect(users[0]);
    });
  });
});
