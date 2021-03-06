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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const user_repository_1 = require("../repositories/user.repository");
const rest_1 = require("@loopback/rest");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let UserController = class UserController {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async getAllUsers(jwt) {
        if (!jwt) {
            throw new rest_1.HttpErrors.Unauthorized("Jwt not valid");
        }
        try {
            jsonwebtoken_1.verify(jwt, 'shh');
            return await this.userRepo.find();
        }
        catch (err) {
            throw new rest_1.HttpErrors.BadRequest("Jwt not verifiable");
        }
    }
    async findUsersById(id) {
        let userExists = !!(await this.userRepo.count({ id }));
        if (!userExists) {
            throw new rest_1.HttpErrors.BadRequest(`user ID ${id} does not exist`);
        }
        return await this.userRepo.findById(id);
    }
    async getDonationsByUserId(userId, dateFrom, authorizationToken) {
        // Some awesome logic down here...
    }
    async updateUsersInfo(body) {
        var uin = body.user;
        // var use = await this.userRepo.findById(user.id);
        var user = await this.userRepo.findById(uin.id);
        let check = await bcrypt.compare(body.user.password, user.password);
        if (check) {
            user.firstname = uin.firstname;
            user.lastname = uin.lastname,
                user.email = uin.email;
            user.id = uin.id;
            if (body.npassword.length > 0) {
                let newhashedPassword = await bcrypt.hash(body.npassword, 10);
                user.password = newhashedPassword;
            }
            await this.userRepo.save(user);
            var jwt = jsonwebtoken_1.sign({
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                },
                anything: "hello"
            }, 'shh', {
                issuer: 'auth.ix.co.za',
                audience: 'ix.co.za',
                expiresIn: '24hr',
            });
            return {
                token: jwt
            };
        }
        else {
            throw new rest_1.HttpErrors.Unauthorized("incorrect password");
        }
    }
};
__decorate([
    rest_1.get('/users'),
    __param(0, rest_1.param.query.string('jwt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    rest_1.get('/users/{id}'),
    __param(0, rest_1.param.path.number('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUsersById", null);
__decorate([
    rest_1.get('/users/{user_id}/donations'),
    __param(0, rest_1.param.path.number('user_id')),
    __param(1, rest_1.param.query.date('date_from')),
    __param(2, rest_1.param.header.string('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date,
        String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDonationsByUserId", null);
__decorate([
    rest_1.put('/users/settings'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUsersInfo", null);
UserController = __decorate([
    __param(0, repository_1.repository(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=users.controller.js.map