import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  type AnswerCommentProps
} from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerCommentsMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override
    },
    id
  )

  return answerComment
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {}
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentsMapper.toPrisma(answerComment)
    })

    return answerComment
  }
}
