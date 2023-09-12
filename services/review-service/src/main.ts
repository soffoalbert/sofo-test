import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ReviewModule } from "./review.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ReviewModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3004,
    },
  });

  await app.listen();
}
bootstrap();

