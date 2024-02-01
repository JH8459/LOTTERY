import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions, OpenAPIObject } from '@nestjs/swagger';

const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    defaultModelsExpandDepth: -1,
  },
};

export function setupSwagger(app: INestApplication): void {
  if (process.env.NODE_ENV === 'dev') {
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
        'accessToken' // @ApiBearerAuth('accessToken') === 'accessToken'
      )
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document, swaggerCustomOptions);
  }
}
