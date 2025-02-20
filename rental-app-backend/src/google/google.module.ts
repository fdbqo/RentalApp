import { Module } from '@nestjs/common';
import { DistanceService } from './google.service';  // Ensure this path is correct

@Module({
  providers: [DistanceService],   // Provide the service
  exports: [DistanceService],     // Export it so other modules can use it
})
export class GoogleModule {}  // Ensure this matches the module name
