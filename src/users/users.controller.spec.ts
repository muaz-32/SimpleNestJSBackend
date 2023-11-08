import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    jest.resetModules();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userData: CreateUserDto = {
        id: uuidv4(),
        email: 'test@example.com',
        name: 'Test User',
        password: 'a1',
      };

      jest.spyOn(service, 'create').mockResolvedValue(userData);

      const result = await controller.create(userData);

      expect(result).toBe(userData);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const userData = [
        {
          id: uuidv4(),
          email: 'test1@example.com',
          name: 'Test User 1',
          password: 'b1',
        },
        {
          id: uuidv4(),
          email: 'test2@example.com',
          name: 'Test User 2',
          password: 'c1',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(userData);

      const result = await controller.findAll();

      expect(result).toBe(userData);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userData = {
        id: uuidv4(),
        email: 'test@example.com',
        name: 'Test User 1',
        password: 'd1',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(userData);

      const result = await controller.findOne(userData.id);

      expect(result).toBe(userData);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userData = {
        id: uuidv4(),
        email: 'a@gmai.com',
        name: 'Test User',
        password: 'e1',
      };
      const updatedUserData: UpdateUserDto = {
        name: 'Updated User',
      };
      const mockedValue = {
        id: userData.id,
        email: userData.email,
        name: updatedUserData.name,
        password: userData.password,
      };

      jest.spyOn(service, 'update').mockResolvedValue(mockedValue);

      const result = await controller.update(userData.id, updatedUserData);

      expect(result).toMatchObject(mockedValue);
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const userData = {
        id: uuidv4(),
        email: 'test@example.com',
        name: 'Test User',
        password: 'f1',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(userData);

      const deletedUser = await controller.remove(userData.id);

      expect(deletedUser).toStrictEqual(userData);
    });
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
