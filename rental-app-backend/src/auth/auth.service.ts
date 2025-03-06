import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { User, UserDocument } from "./user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async register(userDto: CreateUserDto): Promise<any> {
    const { email, password } = userDto;

    if (!email) {
      throw new BadRequestException("Email is required");
    }

    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      ...userDto,
      password: hashedPassword,
    });

    try {
      await newUser.save();
    } catch (error) {
      throw new InternalServerErrorException("Error saving user");
    }

    const { password: _, ...result } = newUser.toObject();
    return result;
  }

  async login(userDto: LoginUserDto): Promise<any> {
    const { email, password } = userDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);

    const { password: hashedPassword, ...userData } = user.toObject();

    return {
      access_token: token,
      user: userData,
    };
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.userModel.findById(payload.sub).exec();
    if (user) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async getCurrentUser(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const { password, ...result } = user.toObject();
    return result;
  }
}
