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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("./user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async register(userDto) {
        const { email, password } = userDto;
        if (!email) {
            throw new common_1.BadRequestException("Email is required");
        }
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            throw new common_1.BadRequestException("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
            ...userDto,
            password: hashedPassword,
        });
        try {
            await newUser.save();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Error saving user");
        }
        const { password: _, ...result } = newUser.toObject();
        return result;
    }
    async login(userDto) {
        const { email, password } = userDto;
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const payload = { email: user.email, sub: user._id };
        const token = this.jwtService.sign(payload);
        const { password: hashedPassword, ...userData } = user.toObject();
        return {
            access_token: token,
            user: userData,
        };
    }
    async validateUser(payload) {
        const user = await this.userModel.findById(payload.sub).exec();
        if (user) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map