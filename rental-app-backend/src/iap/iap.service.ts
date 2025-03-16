import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../auth/user.schema";
import * as appleReceiptVerify from "node-apple-receipt-verify";

@Injectable()
export class IAPService {
  private readonly logger = new Logger(IAPService.name);
  private readonly isDevelopment = process.env.NODE_ENV !== "production";

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    if (!this.isDevelopment) {
      // Configure Apple receipt verification only in production
      appleReceiptVerify.config({
        secret: process.env.APPLE_SHARED_SECRET,
        environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
      });
    }
  }

  async verifyReceipt(userId: string, receipt: string): Promise<any> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        this.logger.error(`User not found: ${userId}`);
        throw new BadRequestException("User not found");
      }

      let productId: string;
      let transactionId: string;

      if (this.isDevelopment) {
        // Handle development mode receipts
        try {
          const mockReceipt = JSON.parse(receipt);
          productId = mockReceipt.productId;
          transactionId = mockReceipt.transactionId;
        } catch (error) {
          throw new BadRequestException("Invalid development receipt format");
        }
      } else {
        // Production verification
        this.logger.log(`Verifying receipt for user ${userId}`);
        const response = await appleReceiptVerify.validate({ receipt });

        if (!response.valid) {
          this.logger.error(`Invalid receipt for user ${userId}`);
          throw new BadRequestException("Invalid receipt");
        }

        const latestTransaction = response.latest_receipt_info[0];
        if (!latestTransaction) {
          throw new BadRequestException("No transaction found in receipt");
        }

        productId = latestTransaction.product_id;
        transactionId = latestTransaction.transaction_id;
      }

      // Map product IDs to amounts
      const productAmounts = {
        "com.rentalapp.topup.small": 10,
        "com.rentalapp.topup.medium": 25,
        "com.rentalapp.topup.large": 50,
      };

      const amount = productAmounts[productId];
      if (!amount) {
        throw new BadRequestException("Invalid product ID");
      }

      // Update user balance
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $inc: { balance: amount } },
        { new: true }
      );

      this.logger.log(
        `Successfully updated balance for user ${userId}: +€${amount}`
      );

      return {
        success: true,
        amount,
        balance: updatedUser.balance,
        transactionId,
        isDevelopment: this.isDevelopment,
      };
    } catch (error) {
      this.logger.error(`Failed to verify receipt: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to verify receipt: ${error.message}`
      );
    }
  }
} 