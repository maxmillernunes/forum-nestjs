import type { Prisma, Attachment as PrismaAttachment } from '@prisma/client'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create({
      title: raw.title,
      url: raw.url,
    })
  }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
