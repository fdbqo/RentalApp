import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Property, PropertyDocument } from "./schemas/property.schema";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
import { DistanceService } from "src/google/google.service";
import { User, UserDocument } from "../auth/user.schema";

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private distanceService: DistanceService
  ) {}

  private calculateListingFee(price: number): number {
    return price * 0.03; // 3% of the monthly price
  }

  async findAll(lenderId: string): Promise<Property[]> {
    try {
      const objectId = new Types.ObjectId(lenderId);
      const properties = await this.propertyModel
        .find({ lenderId: objectId })
        .exec();
      return properties;
    } catch (error) {
      return [];
    }
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      // Check if user exists and is a landlord
      const user = await this.userModel
        .findById(createPropertyDto.lenderId)
        .exec();
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (user.userType !== "landlord") {
        throw new BadRequestException("Only landlords can list properties");
      }

      // Calculate listing fee
      const listingFee = this.calculateListingFee(createPropertyDto.price);

      // Check if user has enough balance
      if (user.balance < listingFee) {
        throw new BadRequestException(
          `Insufficient balance. Required: €${listingFee.toFixed(2)}`
        );
      }

      // Deduct the listing fee from user's balance
      user.balance -= listingFee;
      await user.save();

      const propertyData = {
        ...createPropertyDto,
        lenderId: new Types.ObjectId(createPropertyDto.lenderId),
        images: createPropertyDto.images.map((img) => ({
          _id: new Types.ObjectId(),
          uri: img.uri,
        })),
        listingExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };

      const createdProperty = new this.propertyModel(propertyData);

      // Get an array of nearest universities.
      const nearestUniversities =
        await this.distanceService.getNearestUniversities(createdProperty, 5);
      if (nearestUniversities && nearestUniversities.length) {
        createdProperty.nearestUniversities = nearestUniversities;
        await createdProperty.save();
      }

      return createdProperty.save();
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Property> {
    try {
      const property = await this.propertyModel.findById(id).exec();
      if (!property) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
      return property;
    } catch (error) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto
  ): Promise<Property> {
    try {
      const updatedProperty = await this.propertyModel
        .findByIdAndUpdate(id, updatePropertyDto, { new: true })
        .exec();

      if (!updatedProperty) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }

      // Update nearest universities details.
      const nearestUniversities =
        await this.distanceService.getNearestUniversities(updatedProperty, 5);
      if (nearestUniversities && nearestUniversities.length) {
        updatedProperty.nearestUniversities = nearestUniversities;
        await updatedProperty.save();
      }

      return updatedProperty;
    } catch (error) {
      throw new NotFoundException(`Error updating property: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.propertyModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
    } catch (error) {
      throw new NotFoundException(`Error deleting property: ${error.message}`);
    }
  }

  async findAllAvailable(filters?: any): Promise<Property[]> {
    try {
      const query: any = {};

      if (filters?.searchQuery) {
        query.$or = [
          {
            "houseAddress.townCity": {
              $regex: filters.searchQuery,
              $options: "i",
            },
          },
          {
            "houseAddress.county": {
              $regex: filters.searchQuery,
              $options: "i",
            },
          },
          {
            "houseAddress.addressLine1": {
              $regex: filters.searchQuery,
              $options: "i",
            },
          },
          {
            "houseAddress.addressLine2": {
              $regex: filters.searchQuery,
              $options: "i",
            },
          },
        ];
      }

      // Handle price range
      if (filters?.minPrice || filters?.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = parseInt(filters.minPrice);
        if (filters.maxPrice) query.price.$lte = parseInt(filters.maxPrice);
      }

      // Handle beds filter
      if (filters?.beds) {
        const totalBeds = parseInt(filters.beds);
        query.$expr = {
          $gte: [{ $add: ["$singleBedrooms", "$doubleBedrooms"] }, totalBeds],
        };
      }

      // Handle distance filter (using nearestUniversities array)
      if (filters?.distance) {
        query["nearestUniversities.distance"] = {
          $lte: parseInt(filters.distance),
        };
      }

      return await this.propertyModel.find(query).exec();
    } catch (error) {
      console.error("Error finding properties:", error);
      return [];
    }
  }

  async findByLenderId(lenderId: string): Promise<Property[]> {
    try {
      const objectId = new Types.ObjectId(lenderId);
      return await this.propertyModel.find({ lenderId: objectId }).exec();
    } catch (error) {
      return [];
    }
  }
}
