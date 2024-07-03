import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions, OpenAPIObject } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    defaultModelsExpandDepth: -1,
  },
};

export function setupSwagger(app: INestApplication): void {
  const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('LOTTERY 🍀')
    .setDescription('LOTTERY 🍀 API Swagger 문서')
    .setVersion('V.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'accessToken'
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  app.use(
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD },
    })
  );

  SwaggerModule.setup('api', app, document, swaggerCustomOptions);
}
