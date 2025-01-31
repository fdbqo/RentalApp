"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsModule = void 0;
const common_1 = require("@nestjs/common");
const chats_service_1 = require("./chats.service");
const chats_gateway_1 = require("./chats.gateway");
const mongoose_1 = require("@nestjs/mongoose");
const chat_schemas_1 = require("./schemas/chat.schemas");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
let ChatsModule = class ChatsModule {
};
exports.ChatsModule = ChatsModule;
exports.ChatsModule = ChatsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: chat_schemas_1.Chat.name, schema: chat_schemas_1.ChatSchema }]),
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                secret: 'jwt_secret_key',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        providers: [
            chats_gateway_1.ChatsGateway,
            chats_service_1.ChatsService,
        ],
        exports: [
            chats_service_1.ChatsService,
        ],
    })
], ChatsModule);
//# sourceMappingURL=chats.module.js.map