import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Module } from '@nestjs/common'
import { S3Storage } from './s3-storage'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: S3Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
