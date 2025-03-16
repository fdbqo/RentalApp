import {
  Body,
  Controller,
  Post,
  Headers,
  Req,
  UseGuards,
  Logger,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Request } from "express";

@Controller("payment")
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create-payment-intent")
  async createPaymentIntent(@Req() req, @Body("amount") amount: number) {
    this.logger.log(
      `Creating payment intent for user ${req.user._id} with amount ${amount}`
    );
    return this.paymentService.createPaymentIntent(req.user._id, amount);
  }

  @Post("webhook")
  async handleWebhook(
    @Headers("stripe-signature") signature: string,
    @Req() request: Request
  ) {
    if (!signature) {
      this.logger.error("No Stripe signature found in webhook request");
      throw new Error("No Stripe signature provided");
    }

    this.logger.log("Received Stripe webhook");

    // The body should now be a Buffer thanks to the raw body parser
    const rawBody = request.body;

    if (!Buffer.isBuffer(rawBody)) {
      this.logger.error("Webhook payload is not a Buffer");
      throw new Error("Invalid webhook payload format");
    }

    return this.paymentService.handleWebhook(signature, rawBody);
  }

  @UseGuards(JwtAuthGuard)
  @Post("test-top-up")
  async testTopUp(@Req() req, @Body("amount") amount: number) {
    this.logger.log(
      `Test top-up for user ${req.user._id} with amount ${amount}`
    );
    return this.paymentService.testTopUp(req.user._id, amount);
  }
}
