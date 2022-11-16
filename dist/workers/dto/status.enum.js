"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerStatus = void 0;
var workerStatus;
(function (workerStatus) {
    workerStatus[workerStatus["unlinked"] = 0] = "unlinked";
    workerStatus[workerStatus["pending"] = 1] = "pending";
    workerStatus[workerStatus["linked"] = 2] = "linked";
})(workerStatus = exports.workerStatus || (exports.workerStatus = {}));
//# sourceMappingURL=status.enum.js.map