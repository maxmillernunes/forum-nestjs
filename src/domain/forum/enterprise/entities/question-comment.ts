import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { Comment, type CommentProps } from './comment'
import { CommentOnQuestionEvent } from '../events/comment-on-question-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    const isNewCommentAnswer = !id

    if (isNewCommentAnswer) {
      questionComment.addDomainEvent(
        new CommentOnQuestionEvent(questionComment)
      )
    }

    return questionComment
  }
}
