import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import type { Slug } from './slug'
import type { Attachment } from '../attachment'

export interface QuestionDetailsProps {
  questionId: UniqueEntityId
  title: string
  slug: Slug
  content: string
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityId | null
  createdAt: Date
  updatedAt?: Date | null
  author: {
    id: UniqueEntityId
    name: string
  }
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get author() {
    return this.props.author
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
