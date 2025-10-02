import { Injectable } from '@nestjs/common'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionsMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionsMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id: slug },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionsMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map((question) => PrismaQuestionsMapper.toDomain(question))
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionsMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionsMapper.toPrisma(question)

    await this.prisma.question.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionsMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: { id: data.id },
    })
  }
}
