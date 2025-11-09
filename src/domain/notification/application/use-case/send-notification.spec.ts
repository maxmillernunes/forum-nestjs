import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a new notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      content: 'Content from new Notification',
      title: 'Title from new Notification',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    )
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
  })
})
