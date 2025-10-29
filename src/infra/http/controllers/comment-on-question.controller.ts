import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestionUseCase: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.commentOnQuestionUseCase.execute({
      authorId: userId,
      questionId: questionId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
