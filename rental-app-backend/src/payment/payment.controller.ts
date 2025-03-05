import {
  Body,
  Controller,
  Post,
  Headers,
  Req,
  UseGuards,
  RawBodyRequest,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Request } from "express";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create-payment-intent")
  async createPaymentIntent(@Req() req, @Body("amount") amount: number) {
    return this.paymentService.createPaymentIntent(req.user._id, amount);
  }

  @Post("webhook")
  async handleWebhook(
    @Headers("stripe-signature") signature: string,
    @Req() request: RawBodyRequest<Request>
  ) {
    return this.paymentService.handleWebhook(signature, request.rawBody);
  }
}
