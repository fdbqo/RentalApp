import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../auth/user.schema";
import Stripe from "stripe";

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    if (!process.env.STRIPE_SECRET_KEY) {
      this.logger.error(
        "STRIPE_SECRET_KEY is not set in environment variables"
      );
      throw new Error("STRIPE_SECRET_KEY is required");
    }

    this.logger.log("Initializing Stripe with API key");
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }

  async createPaymentIntent(
    userId: string,
    amount: number
  ): Promise<{ clientSecret: string }> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        this.logger.error(`User not found: ${userId}`);
        throw new Error("User not found");
      }

      this.logger.log(
        `Creating payment intent for user ${userId} with amount €${amount}`
      );
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        metadata: {
          userId: userId.toString(), // Convert ObjectId to string
        },
      });

      this.logger.log(
        `Payment intent created successfully: ${paymentIntent.id}`
      );
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      this.logger.error(`Failed to create payment intent: ${error.message}`);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`
      );
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "payment_intent.succeeded") {
        await this.handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
      } else if (event.type === "payment_intent.payment_failed") {
        await this.handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
      } else {
        this.logger.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`);
      throw new InternalServerErrorException("Webhook processing failed");
    }
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ) {
    const userId = paymentIntent.metadata.userId;
    const amount = paymentIntent.amount / 100; // Convert from cents to euros

    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $inc: { balance: amount } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error(`User ${userId} not found`);
      }

      this.logger.log(
        `Successfully updated balance for user ${userId}: +€${amount}`
      );
    } catch (error) {
      this.logger.error(`Failed to update user balance: ${error.message}`);
      throw new Error(`Failed to update user balance: ${error.message}`);
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const userId = paymentIntent.metadata.userId;
    this.logger.warn(
      `Payment failed for user ${userId}: ${paymentIntent.last_payment_error?.message || "Unknown error"}`
    );
  }

  async testTopUp(userId: string, amount: number) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $inc: { balance: amount } },
        { new: true }
      );

      if (!updatedUser) {
        this.logger.error(`User ${userId} not found`);
        throw new Error(`User not found`);
      }

      this.logger.log(
        `Successfully updated balance for user ${userId}: +€${amount}`
      );

      return {
        success: true,
        amount,
        balance: updatedUser.balance,
      };
    } catch (error) {
      this.logger.error(`Failed to update user balance: ${error.message}`);
      throw new Error(`Failed to update user balance: ${error.message}`);
    }
  }
}
