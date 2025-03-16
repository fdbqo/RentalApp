import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Logger,
} from "@nestjs/common";
import { IAPService } from "./iap.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("iap")
export class IAPController {
  private readonly logger = new Logger(IAPController.name);

  constructor(private readonly iapService: IAPService) {}

  @UseGuards(JwtAuthGuard)
  @Post("verify-receipt")
  async verifyReceipt(@Req() req, @Body("receipt") receipt: string) {
    this.logger.log(`Verifying receipt for user ${req.user._id}`);
    return this.iapService.verifyReceipt(req.user._id, receipt);
  }
} 