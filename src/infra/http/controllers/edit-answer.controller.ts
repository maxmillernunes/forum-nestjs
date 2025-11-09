import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswers: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') answerId: string,
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, attachments } = body
    const userId = user.sub

    const result = await this.editAnswers.execute({
      answerId,
      content,
      authorId: userId,
      attachmentIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
