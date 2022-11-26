import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // create
  async createUser(userCreateInput: Prisma.UserCreateInput) {
    // check if user already exists
    if (
      await this.findUserByIdOrEmail({
        email: userCreateInput.email,
      })
    ) {
      return null;
    }
    // store encrypted password in database
    return this.prisma.user.create({
      data: {
        ...userCreateInput,
        password: await bcrypt.hash(userCreateInput.password, 10),
      },
      select: {
        email: true,
      },
    });
  }

  // read
  async findUserByIdOrEmail(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  // update
  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  // delete
  async deleteUserByIdOrEmail(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }
}
