import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnCommentOnAnswer } from '@/domain/notification/application/subscribers/on-comment-on-answer'
import { OnCommentOnQuestion } from '@/domain/notification/application/subscribers/on-comment-on-question'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { SendNotificationUseCase } from '@/domain/notification/application/use-case/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnCommentOnAnswer,
    OnCommentOnQuestion,
    OnQuestionBestAnswerChosen,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
