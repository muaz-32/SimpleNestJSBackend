import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeAll(async () => {
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
        id: uuidv4(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const createdUser = await service.create(userData);

      expect(createdUser).toMatchObject(userData);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const userData: Prisma.UserCreateManyInput[] = [
        {
          id: uuidv4(),
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
        },
        {
          id: uuidv4(),
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
        },
      ];

      await prismaService.user.createMany({ data: userData });

      const users = await service.findAll({});

      expect(users).toHaveLength(2);
      for (const user of users) {
        expect(userData).toContainEqual(user);
      }
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userData: Prisma.UserCreateInput = {
        id: uuidv4(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const createdUser = await prismaService.user.create({ data: userData });

      const foundUser = await service.findOne({ id: createdUser.id });

      expect(foundUser).toMatchObject(userData);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const userData: Prisma.UserCreateInput = {
        id: uuidv4(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };
      const updatedUserData: Prisma.UserUpdateInput = {
        name: faker.person.fullName(),
      };

      const createdUser = await prismaService.user.create({ data: userData });

      const updatedUser = await service.update({
        where: { id: createdUser.id },
        data: updatedUserData,
      });

      expect(updatedUser).toMatchObject(updatedUserData);

      const foundUser = await prismaService.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(foundUser).toMatchObject(updatedUserData);
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const userData: Prisma.UserCreateInput = {
        id: uuidv4(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      };

      const createdUser = await prismaService.user.create({ data: userData });

      const deletedUser = await service.remove({ id: createdUser.id });

      expect(deletedUser).toMatchObject(createdUser);

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
