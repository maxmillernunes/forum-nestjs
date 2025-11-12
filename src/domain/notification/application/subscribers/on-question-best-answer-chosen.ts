import type { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-case/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  async sendQuestionBestAnswerNotification({
    bestAnswerId,
    question,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: 'Sua response foi escolhida',
        content: `A resposta que voce envio em "${question.title
          .substring(0, 100)
          .concat('...')} foi escolhida pelo autor!"`,
      })
    }
  }
}
