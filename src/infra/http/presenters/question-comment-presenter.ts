import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class QuestionCommentPresenter {
  static toHTTP(question: QuestionComment) {
    return {
      id: question.id.toString(),
      content: question.content,
      authorId: question.authorId.toString(),
      questionId: question.questionId.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
