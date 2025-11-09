import type { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      content: questionDetails.content,
      attachments: questionDetails.attachments.map((attachment) =>
        AttachmentPresenter.toHTTP(attachment),
      ),
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
      author: {
        id: questionDetails.author.id.toString(),
        name: questionDetails.author.name,
      },
    }
  }
}
