import { DomainEvents } from '@/core/events/domain-events'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findById(questionId: string) {
    const question = this.items.find(
      (item) => item.id.toString() === questionId,
    )

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find((student) =>
      student.id.equals(question.authorId),
    )

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exists`,
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => questionAttachment.questionId.equals(question.id),
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) =>
        attachment.id.equals(questionAttachment.attachmentId),
      )

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exists`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      slug: question.slug,
      title: question.title,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      attachments,
      author: {
        id: author.id,
        name: author.name,
      },
    })
  }

  async findManyRecent({ page }: PaginationParams) {
    const question = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return question
  }

  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items[questionIndex] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items.splice(questionIndex, 1)

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
