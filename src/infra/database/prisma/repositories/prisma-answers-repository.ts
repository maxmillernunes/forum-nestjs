import { Injectable } from '@nestjs/common'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PrismaService } from '../prisma.service'
import { PrismaAnswersMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(answerId: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswersMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map((answer) => PrismaAnswersMapper.toDomain(answer))
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswersMapper.toPrisma(answer)

    await this.prisma.answer.create({
      data,
    })
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswersMapper.toPrisma(answer)

    await this.prisma.answer.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(answer: Answer): Promise<void> {
    const data = PrismaAnswersMapper.toPrisma(answer)

    await this.prisma.answer.delete({
      where: { id: data.id },
    })
  }
}
