import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload
  ): Promise<void> {
    const userId = user.sub

    const result = await this.deleteQuestion.execute({
      authorId: userId,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
