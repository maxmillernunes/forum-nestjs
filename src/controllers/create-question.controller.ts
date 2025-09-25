import z from 'zod'
import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard'
import { CurrentUser } from 'src/auth/current-user-decorator'
import type { UserPayload } from 'src/auth/jwt.strategy'

const createQuestionBodySchema = z.object({})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@UseGuards(JwtAuthGuard)
@Controller('/questions')
export class CreateQuestionController {
  constructor() {}

  @Post()
  async handle(@CurrentUser() user: UserPayload) {
    return 'ok'
  }
}
