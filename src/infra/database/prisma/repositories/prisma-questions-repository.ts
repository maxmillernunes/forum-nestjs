import { Injectable } from '@nestjs/common'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
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
    throw new Error('Method not implemented.')
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.')
  }

  async create(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
