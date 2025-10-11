import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get Question By Slug', () => {
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

  test('[GET] /questions/:slug', async () => {
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
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions/example-question-title-1')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'Example question title 1',
      }),
    })
  })
})
