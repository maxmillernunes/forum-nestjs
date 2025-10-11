import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    await questionFactory.makePrismaQuestion({
      title: 'Example question title 1',
      authorId: user.id,
    })

    await questionFactory.makePrismaQuestion({
      title: 'Example question title 2',
      authorId: user.id,
    })
    await questionFactory.makePrismaQuestion({
      title: 'Example question title 3',
      authorId: user.id,
    })

    const token = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({
          title: 'Example question title 3',
        }),
        expect.objectContaining({
          title: 'Example question title 2',
        }),
        expect.objectContaining({
          title: 'Example question title 1',
        }),
      ],
    })
  })
})
