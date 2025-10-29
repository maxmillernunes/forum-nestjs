import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { QuestionCommentPresenter } from '../presenters/question-comment-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const QueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComment: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', QueryValidationPipe) page: PageQueryParamSchema
  ) {
    const result = await this.fetchQuestionComment.execute({
      questionId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questionComments = result.value.questionComments

    return {
      comments: questionComments.map(QuestionCommentPresenter.toHTTP),
    }
  }
}
