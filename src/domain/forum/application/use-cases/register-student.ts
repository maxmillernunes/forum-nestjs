import { Injectable } from '@nestjs/common'
import { left, right, type Either } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { StudentsRepository } from '../repositories/student-repository'
import { HashGenerator } from '../cryptography/hash-generator'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const userWithSameEmail = await this.studentsRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      email,
      name,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}
