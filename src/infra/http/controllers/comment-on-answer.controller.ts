import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswerUseCase: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @Param('answerId') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.commentOnAnswerUseCase.execute({
      authorId: userId,
      answerId: answerId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
