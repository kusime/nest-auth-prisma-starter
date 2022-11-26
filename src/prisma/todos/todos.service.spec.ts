import { prismaMock } from '../test/singleton';
import { TodosService } from './todos.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';

// this level of testing is aim to be able to check the data reveal is correct,
// and we use the mock prisma client , so this might not be able to check error like
// the main key is duplicated ... since in here we are not connect to the database actually
describe('UsersService', () => {
  let service: TodosService;

  beforeEach(async () => {
    // https://www.prisma.io/docs/guides/testing/unit-testing#dependency-injection
    // prepare the prisma context
    const module = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: prismaMock },
        TodosService,
      ],
    }).compile();
    service = await module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
