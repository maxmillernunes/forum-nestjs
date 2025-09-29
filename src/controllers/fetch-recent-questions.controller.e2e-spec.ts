import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import request from 'supertest'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get<PrismaService>(PrismaService)
    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      },
    })

    const token = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Example question title 1',
          content: 'Example question content 1',
          authorId: user.id,
          slug: 'example-question-title-1',
        },
        {
          title: 'Example question title 2',
          content: 'Example question content 2',
          authorId: user.id,
          slug: 'example-question-title-2',
        },
        {
          title: 'Example question title 3',
          content: 'Example question content 3',
          authorId: user.id,
          slug: 'example-question-title-3',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({
          title: 'Example question title 1',
        }),
        expect.objectContaining({
          title: 'Example question title 2',
        }),
        expect.objectContaining({
          title: 'Example question title 3',
        }),
      ],
    })
  })
})
