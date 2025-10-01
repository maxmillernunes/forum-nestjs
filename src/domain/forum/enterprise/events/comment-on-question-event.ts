import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'
import type { QuestionComment } from '../entities/question-comment'

export class CommentOnQuestionEvent implements DomainEvent {
  occurredAt: Date
  questionComment: QuestionComment

  constructor(questionComment: QuestionComment) {
    this.questionComment = questionComment
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.questionComment.id
  }
}
