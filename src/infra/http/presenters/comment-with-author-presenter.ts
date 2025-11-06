import type { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(question: CommentWithAuthor) {
    return {
      commentId: question.commentId.toString(),
      content: question.content,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: {
        id: question.author.id.toString(),
        name: question.author.name,
      },
    }
  }
}
