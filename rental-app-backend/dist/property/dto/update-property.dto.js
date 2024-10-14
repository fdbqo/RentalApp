"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePropertyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_property_dto_1 = require("./create-property.dto");
class UpdatePropertyDto extends (0, mapped_types_1.PartialType)(create_property_dto_1.CreatePropertyDto) {
}
exports.UpdatePropertyDto = UpdatePropertyDto;
//# sourceMappingURL=update-property.dto.js.map