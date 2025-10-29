import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class AnswerCommentPresenter {
  static toHTTP(answer: AnswerComment) {
    return {
      id: answer.id.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      answerId: answer.answerId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
