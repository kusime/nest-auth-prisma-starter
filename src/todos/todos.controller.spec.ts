import { TodosController } from './todos.controller';
import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import { TodosService } from '../prisma/todos/todos.service';
import { jwtPayloadKey } from '../constant/jwtToken';
import { prismaMock } from '../prisma/test/singleton';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

describe('TodosController', () => {
  let controller: TodosController;
  let todo_service: TodosService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Logger,
        { provide: PrismaService, useValue: prismaMock },
        TodosService,
      ],
      controllers: [TodosController],
    }).compile();
    todo_service = await module.get<TodosService>(TodosService);
    controller = await module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create new todo', async () => {
    jest.spyOn(todo_service, 'createUserTodo').mockResolvedValue({
      content: 'test content',
      id: 'test id',
    });
    expect(
      await controller.createNewTodo({
        content: 'test content',
        [jwtPayloadKey]: 'test_email',
      }),
    ).toEqual({
      isSuccess: true,
      info: {
        statusCode: HttpStatus.OK,
        message: 'Todo Create Successfully',
      },
    });
  });

  it('should be throw BadRequestException when create new todo is failed', async () => {
    jest.spyOn(todo_service, 'createUserTodo').mockImplementation(() => {
      throw new Error('TEST : Prisma not working properly');
    });
    try {
      await controller.createNewTodo({
        content: 'test content',
        [jwtPayloadKey]: 'test_email',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
