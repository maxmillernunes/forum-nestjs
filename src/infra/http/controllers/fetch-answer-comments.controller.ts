import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const QueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComment: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Param('answerId') answerId: string,
    @Query('page', QueryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchAnswerComment.execute({
      answerId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answerComments = result.value.comments

    return {
      comments: answerComments.map((comment) =>
        CommentWithAuthorPresenter.toHTTP(comment),
      ),
    }
  }
}
