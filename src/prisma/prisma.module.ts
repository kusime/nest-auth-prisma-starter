import { Module } from '@nestjs/common';
import { TodosService } from './todos/todos.service';
import { UsersService } from './users/users.service';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, TodosService, UsersService],
  exports: [TodosService, UsersService],
})
export class PrismaModule {}
