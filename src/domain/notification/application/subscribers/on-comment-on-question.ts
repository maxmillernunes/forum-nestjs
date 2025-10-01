import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import { CommentOnQuestionEvent } from '@/domain/forum/enterprise/events/comment-on-question-event'
import { SendNotificationUseCase } from '../use-case/send-notification'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

export class OnCommentOnQuestion implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewCommentOnQuestionNotification.bind(this),
      CommentOnQuestionEvent.name,
    )
  }

  async sendNewCommentOnQuestionNotification({
    questionComment,
  }: CommentOnQuestionEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (!question) return

    await this.sendNotificationUseCase.execute({
      recipientId: question.authorId.toString(),
      title: `Sua pergunta: "${question.title.substring(0, 40).concat('...')}", recebeu um novo comentário.`,
      content: `Comentário: ${questionComment.content.substring(0, 120).concat('...')}`,
    })
  }
}
