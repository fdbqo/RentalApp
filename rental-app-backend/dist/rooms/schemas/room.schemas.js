"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDocument = exports.RoomSchema = exports.Room = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const room_type_enum_1 = require("../enums/room-type.enum");
let Room = class Room {
};
exports.Room = Room;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: room_type_enum_1.RoomType, default: room_type_enum_1.RoomType.PERSONAL }),
    __metadata("design:type", String)
], Room.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            type: mongoose_2.default.Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: { select: 'firstName lastName email' }
        }]),
    __metadata("design:type", Array)
], Room.prototype, "members", void 0);
exports.Room = Room = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
        toJSON: ({
            transform(_, ret, __) {
                return new RoomDocument(ret);
            },
            virtuals: true
        })
    })
], Room);
exports.RoomSchema = mongoose_1.SchemaFactory.createForClass(Room);
class RoomDocument {
    constructor(props) {
        this._id = props._id;
        this.members = props.members;
        this.name = props.name;
        this.type = props.type;
        if (this.type == room_type_enum_1.RoomType.PERSONAL) {
            this.name = this.members.find((member) => member._id.toString() !== this._id.toString()).firstName;
        }
    }
}
exports.RoomDocument = RoomDocument;
//# sourceMappingURL=room.schemas.js.map