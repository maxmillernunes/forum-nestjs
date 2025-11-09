import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      title: raw.title,
      slug: Slug.create(raw.slug),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      attachments: raw.attachments.map((attachment) =>
        PrismaAttachmentMapper.toDomain(attachment),
      ),
      author: {
        id: new UniqueEntityId(raw.author.id),
        name: raw.author.name,
      },
    })
  }
}
