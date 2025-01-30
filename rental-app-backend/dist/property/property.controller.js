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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const property_service_1 = require("./property.service");
const create_property_dto_1 = require("./dto/create-property.dto");
const update_property_dto_1 = require("./dto/update-property.dto");
const get_chat_dto_1 = require("../chats/dto/get-chat.dto");
const chats_service_1 = require("../chats/chats.service");
let PropertyController = class PropertyController {
    constructor(propertyService, chatsService) {
        this.propertyService = propertyService;
        this.chatsService = chatsService;
    }
    async getAllProperties(lenderId, filters) {
        if (lenderId) {
            return this.propertyService.findByLenderId(lenderId);
        }
        return this.propertyService.findAllAvailable(filters);
    }
    async create(createPropertyDto) {
        return this.propertyService.create(createPropertyDto);
    }
    async getPropertyById(id) {
        return this.propertyService.findById(id);
    }
    async updateProperty(id, updatePropertyDto) {
        return this.propertyService.update(id, updatePropertyDto);
    }
    async deleteProperty(id) {
        return this.propertyService.delete(id);
    }
    async getPropertyChats(id, getChatDto) {
        return this.chatsService.findByProperty(id, new get_chat_dto_1.GetChatDto(getChatDto));
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('lenderId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getAllProperties", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "updateProperty", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "deleteProperty", null);
__decorate([
    (0, common_1.Get)(':id/chats'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_chat_dto_1.GetChatDto]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertyChats", null);
exports.PropertyController = PropertyController = __decorate([
    (0, common_1.Controller)('listings'),
    __metadata("design:paramtypes", [property_service_1.PropertyService, chats_service_1.ChatsService])
], PropertyController);
//# sourceMappingURL=property.controller.js.map