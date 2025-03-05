import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { WsAdapter } from "@nestjs/platform-ws";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useWebSocketAdapter(new WsAdapter(app));

  app.use((req, res, next) => {
    if (req.originalUrl === "/payment/webhook") {
      next();
    } else {
      bodyParser.json()(req, res, next);
    }
  });

  app.use("/payment/webhook", bodyParser.raw({ type: "application/json" }));

  await app.listen(3000);
  console.log("🚀 Server running on http://localhost:3000");
}
bootstrap();
