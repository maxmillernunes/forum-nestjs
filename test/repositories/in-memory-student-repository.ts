import type { StudentsRepository } from '@/domain/forum/application/repositories/student-repository'
import type { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentRepository implements StudentsRepository {
  public itens: Student[] = []

  async findByEmail(email: string) {
    const student = this.itens.find((student) => student.email === email)

    if (!student) {
      return null
    }

    return student
  }

  async create(student: Student) {
    this.itens.push(student)
  }
}
