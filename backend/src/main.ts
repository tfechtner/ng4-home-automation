import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: console
    });
    app.enableCors();
    app.enableShutdownHooks();
    await app.listen(3000, '192.168.0.44');
}

bootstrap().finally();
