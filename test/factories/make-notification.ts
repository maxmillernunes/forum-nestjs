import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id
  )

  return notification
}

// @Injectable()
// export class QuestionCommentFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaNotification(
//     data: Partial<NotificationProps> = {}
//   ): Promise<Notification> {
//     const notification = makeNotification(data)

//     await this.prisma.comment.create({
//       data: PrismaNotificationsMapper.toPrisma(notification),
//     })

//     return notification
//   }
// }
