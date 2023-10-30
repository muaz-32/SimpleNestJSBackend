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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userData: CreateUserDto = {
        id: uuidv4(),
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };

      jest.spyOn(service, 'create').mockResolvedValue(userData);

      const result = await controller.create(userData);

      expect(result).toBe(userData);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: uuidv4(),
          email: 'test1@example.com',
          name: 'Test User 1',
          password: '123',
        },
        {
          id: uuidv4(),
          email: 'test2@example.com',
          name: 'Test User 2',
          password: '1234',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: uuidv4(),
        email: 'test@example.com',
        name: 'Test User',
        password: '123',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne(user.id);

      expect(result).toBe(user);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const userData = {
        id: uuidv4(),
        email: 'test@example.com',
        name: 'Test',
        password: '1234',
      };

      const updateData: UpdateUserDto = {
        name: 'Updated User',
      };
      const updatedUser = userData;
      updatedUser.name = updateData.name;

      jest.spyOn(service, 'update').mockResolvedValue(userData);

      const result = await controller.update(userData.id, updateData);

      expect(result).toStrictEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const user = {
        id: uuidv4(),
        email: 'test@example.com',
        name: 'Test User',
        password: '12345',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(user);

      const result = await controller.remove(user.id);

      expect(result).toStrictEqual(user);
    });
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
