import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  // create
  async createUserTodo(data: Prisma.TodosCreateInput) {
    return await this.prisma.todos.create({
      data,
      select: {
        id: true,
        content: true,
      },
    });
  }
  // read
  async findAllTodoByUser(where: Prisma.TodosWhereInput) {
    return await this.prisma.todos.findMany({
      where,
      select: { id: true, content: true },
    });
  }

  async findTodoByID(where: Prisma.TodosWhereUniqueInput) {
    return await this.prisma.todos.findUnique({
      where,
      select: { id: true, content: true },
    });
  }
  // update user todo
  async updateTodo(
    where: Prisma.TodosWhereUniqueInput,
    data: Prisma.TodosUpdateInput,
  ) {
    return await this.prisma.todos.update({
      where,
      data,
      select: {
        id: true,
        content: true,
      },
    });
  }
  // delete userTodo
  async deleteTodosByID(where: Prisma.TodosWhereUniqueInput) {
    return await this.prisma.todos.delete({
      where,
    });
  }
}
