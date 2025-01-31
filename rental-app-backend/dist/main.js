"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const platform_ws_1 = require("@nestjs/platform-ws");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    await app.listen(3000);
    console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
//# sourceMappingURL=main.js.map