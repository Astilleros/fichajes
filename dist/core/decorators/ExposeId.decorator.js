"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExposeId = void 0;
const class_transformer_1 = require("class-transformer");
const ExposeId = (options) => {
    return (target, propertyKey) => {
        (0, class_transformer_1.Transform)((p) => p.obj[p.key].toString())(target, propertyKey);
    };
};
exports.ExposeId = ExposeId;
//# sourceMappingURL=ExposeId.decorator.js.map