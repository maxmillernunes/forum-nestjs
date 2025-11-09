import { left, right, type Either } from '@/core/either'
import type { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface EditAnswerRequest {
  answerId: string
  authorId: string
  content: string
  attachmentIds: string[]
}

type EditAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentIds,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    /**
     * Getting the attachments from database
     */
    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    /**
     * Create a current item from attachment watched list
     */
    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    /**
     * Create new answer attachment list with attachmentId sent
     */
    const newAnswerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    /**
     * Updating into watched list
     */
    answerAttachmentList.update(newAnswerAttachments)

    /**
     * Update the answer with new infos
     */
    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answersRepository.save(answer)

    return right({ answer })
  }
}
