import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Student,
  type StudentProps,
} from '@/domain/forum/enterprise/entities/student'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityId
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  )

  return student
}
