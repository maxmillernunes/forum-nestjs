import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import type { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Get Question By Slug', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const question = await questionFactory.makePrismaQuestion({
      title: 'Example question title 1',
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const token = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/questions/example-question-title-1')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'Example question title 1',
        author: expect.objectContaining({
          name: 'John Doe',
        }),
        attachments: expect.arrayContaining([
          expect.objectContaining({
            title: 'Some attachment',
          }),
        ]),
      }),
    })
  })
})
