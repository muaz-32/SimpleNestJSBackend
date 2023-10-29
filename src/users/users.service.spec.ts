import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Clean up the test database after each test
    await prismaService.user.deleteMany({});
  });

  afterAll(async () => {
    // Close the Prisma client after all tests
    await prismaService.$disconnect();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userData: Prisma.UserCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };

      const createdUser = await service.create(userData);

      expect(createdUser).toMatchObject({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const userData: Prisma.UserCreateInput[] = [
        {
          email: 'test1@example.com',
          name: 'Test User 1',
          password: 'password',
        },
        {
          email: 'test2@example.com',
          name: 'Test User 2',
          password: 'password',
        },
      ];

      await prismaService.user.createMany({ data: userData });

      const users = await service.findAll({});

      expect(users).toHaveLength(2);
      expect(users[0]).toMatchObject({
        email: 'test1@example.com',
        name: 'Test User 1',
        password: 'password',
      });
      expect(users[1]).toMatchObject({
        email: 'test2@example.com',
        name: 'Test User 2',
        password: 'password',
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userData: Prisma.UserCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };

      const createdUser = await prismaService.user.create({ data: userData });

      const foundUser = await service.findOne({ id: createdUser.id });

      expect(foundUser).toMatchObject({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      });
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const userData: Prisma.UserCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };

      const createdUser = await prismaService.user.create({ data: userData });

      const updatedUser = await service.update({
        where: { id: createdUser.id },
        data: { name: 'Updated User' },
      });

      expect(updatedUser).toMatchObject({
        email: 'test@example.com',
        name: 'Updated User',
        password: 'password',
      });
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const userData: Prisma.UserCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };

      const createdUser = await prismaService.user.create({ data: userData });

      const removedUser = await service.remove({ id: createdUser.id });

      expect(removedUser).toMatchObject({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      });

      const foundUser = await prismaService.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(foundUser).toBeNull();
    });
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});