import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Konfigurasi Swagger dengan Identitas Anda
  const config = new DocumentBuilder()
    .setTitle('Blockchain API - Raihan Shandi Adrida Meilano') // Nama di Header
    .setDescription(
      `Peserta Short Course Dapps
       Nama: Raihan Shandi Adrida Meilano
       NIM: 241011401315`,
    ) // NIM di Deskripsi
    .setVersion('1.0')
    .addTag('Blockchain')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
// Di dalam file main.ts
const port = process.env.PORT || 3000;
await app.listen(port);
}
bootstrap();