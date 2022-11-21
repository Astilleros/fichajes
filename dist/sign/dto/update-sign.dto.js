"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSignDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_sign_dto_1 = require("./create-sign.dto");
class UpdateSignDto extends (0, mapped_types_1.PartialType)(create_sign_dto_1.CreateSignDto) {
}
exports.UpdateSignDto = UpdateSignDto;
//# sourceMappingURL=update-sign.dto.js.map