import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { TodosService } from '../prisma/todos/todos.service';
import { BodyChecker } from '../decorator/request-user.decorator';
import { JwtExtract } from '../decorator/jwt-extract.decorator';
import { jwtPayloadKey } from '../constant/jwtToken';
import { ApiResponse } from '../interface/api-response';

@Controller('todos')
export class TodosController {
  constructor(
    private readonly logger: Logger,
    private readonly todos: TodosService,
  ) {}

  // create
  @HttpCode(HttpStatus.OK)
  @Post('create')
  async createNewTodo(
    @BodyChecker({
      check: ['content'],
      isJwt: true,
    })
    body: {
      content: string;
      [jwtPayloadKey]: string;
    },
  ): Promise<ApiResponse> {
    try {
      await this.todos.createUserTodo({
        content: body.content,
        author: {
          connect: {
            email: body[jwtPayloadKey],
          },
        },
      });
      return {
        isSuccess: true,
        info: {
          statusCode: HttpStatus.OK,
          message: 'Todo Create Successfully',
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Create new todo failed');
    }
  }

  // read
  @Get('getAll')
  async getAllUserTodos(
    @JwtExtract() email: string,
  ): Promise<{ content: string; id: string }[]> {
    return await this.todos.findAllTodoByUser({
      author: {
        email,
      },
    });
  }

  // update
  @Post('update')
  async updateTodo(
    @BodyChecker({
      check: ['todoID', 'newContent'],
      isJwt: true,
    })
    body: {
      todoID: string;
      newContent: string;
    },
  ): Promise<ApiResponse> {
    const checkID = await this.todos.findTodoByID({
      id: body.todoID,
    });
    if (checkID === null) {
      // todo id not exist throw bad request exception
      return {
        isSuccess: false,
        info: {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Todo not found',
        },
      };
    }
    await this.todos.updateTodo(
      {
        id: body.todoID,
      },
      {
        content: body.newContent,
      },
    );

    return {
      isSuccess: true,
      info: {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Todo updated successfully',
      },
    };
  }
  // delete
  @HttpCode(HttpStatus.OK)
  @Post('delete')
  async deleteTodo(
    @BodyChecker({
      check: ['todoID'],
      isJwt: true,
    })
    body: {
      todoID: string;
    },
  ): Promise<ApiResponse> {
    const checkID = await this.todos.findTodoByID({
      id: body.todoID,
    });
    if (checkID === null) {
      // todo id not exist throw bad request exception
      return {
        isSuccess: false,
        info: {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Todo not found',
        },
      };
    }
    await this.todos.deleteTodosByID({
      id: body.todoID,
    });
    return {
      isSuccess: true,
      info: {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Todo delete successfully',
      },
    };
  }
}
