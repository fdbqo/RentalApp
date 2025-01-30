"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetChatDto {
    constructor(data) {
        this.limit = 10;
        Object.assign(this, data);
    }
}
exports.GetChatDto = GetChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    __metadata("design:type", String)
], GetChatDto.prototype, "lastId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        default: 10,
    }),
    __metadata("design:type", Number)
], GetChatDto.prototype, "limit", void 0);
//# sourceMappingURL=get-chat.dto.js.map