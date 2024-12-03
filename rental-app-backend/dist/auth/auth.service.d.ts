import { UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(userDto: CreateUserDto): Promise<any>;
    login(userDto: LoginUserDto): Promise<any>;
    validateUser(payload: any): Promise<any>;
}
