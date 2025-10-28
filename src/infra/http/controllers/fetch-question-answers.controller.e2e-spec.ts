import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from 'test/factories/make-answer'

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      title: 'Example question title 1',
      authorId: user.id,
    })

    const questionId = question.id.toString()

    await Promise.all([
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
        content: 'Example answer content 1',
      }),
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
        content: 'Example answer content 2',
      }),
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
        content: 'Example answer content 3',
      }),
    ])

    const token = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({
          content: 'Example answer content 1',
        }),
        expect.objectContaining({
          content: 'Example answer content 2',
        }),
        expect.objectContaining({
          content: 'Example answer content 3',
        }),
      ]),
    })
  })
})
