import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let thisTimeToken: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const testUser = {
    email: 'e2e-TEST@gmail.com',
    name: 'kusime',
    password: 'yangyiming',
  };
  const testLogin = {
    email: testUser.email,
    password: testUser.password,
  };

  it('POST /users/register: register a new user', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send(testUser)
      .expect(200)
      .expect({
        info: {
          statusCode: HttpStatus.CREATED,
          message: `Create ${testUser.email} successfully !!`,
        },
        isSuccess: true,
      });
  });

  it('POST /users/register: already a exist user', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send(testUser)
      .expect(200)
      .expect({
        info: {
          statusCode: HttpStatus.CONFLICT,
          error: `Create User Failed, user already exists`,
        },
        isSuccess: false,
      });
  });

  it('POST /users/login: login success', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send(testLogin)
      .expect(200)
      .expect((res) => {
        console.log('POST /users/login: login success >>>', res.body);
        res.body.info.message = 'Logging successfully';
        thisTimeToken = res.body.auth.access_token;
      });
  });

  it('POST /todos/create: create new todo with  Authentication', () => {
    return request(app.getHttpServer())
      .post('/todos/create')
      .set('Authorization', `Bearer ${thisTimeToken}`)
      .send({
        content: 'e2e-Testing',
      })
      .expect(HttpStatus.OK)
      .expect({
        isSuccess: true,
        info: {
          statusCode: HttpStatus.OK,
          message: 'Todo Create Successfully',
        },
      });
  });

  it('POST /todos/create: create new todo with out Authentication', () => {
    return request(app.getHttpServer())
      .post('/todos/create')
      .send({
        content: 'e2e-Testing',
      })
      .expect(401)
      .expect({
        info: {
          statusCode: 401,
          message: 'Jwt Authentication Failed',
          error: {},
        },
        isSuccess: false,
      });
  });

  it('GET /todos/getAll: get all  todo with  Authentication', () => {
    // https://github.com/facebook/jest/issues/3457
    return request(app.getHttpServer())
      .get('/todos/getAll')
      .set('Authorization', `Bearer ${thisTimeToken}`)
      .expect(200)
      .expect((res) => {
        console.log(res.body);
        Array.isArray(res.body);
      });
  });
});
