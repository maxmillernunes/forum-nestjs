import type { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
implements NotificationsRepository
{
  public itens: Notification[] = []

  async findById(id: string) {
    const notification = this.itens.find((item) => item.id.toString() === id)

    if (!notification) {
      return null
    }

    return notification
  }

  async create(notification: Notification) {
    this.itens.push(notification)
  }

  async save(notification: Notification) {
    const itemIndex = this.itens.findIndex(
      (item) => item.id === notification.id,
    )

    this.itens[itemIndex] = notification
  }
}
