import { prismaMock } from '../test/singleton';
import { TodosService } from './todos.service';

// this level of testing is aim to be able to check the data reveal is correct,
// and we use the mock prisma client , so this might not be able to check error like
// the main key is duplicated ... since in here we are not connect to the database actually
describe('UsersService', () => {
  let service: TodosService;

  beforeEach(() => {
    // https://www.prisma.io/docs/guides/testing/unit-testing#dependency-injection
    // prepare the prisma context
    service = new TodosService(prismaMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
