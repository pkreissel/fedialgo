"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticArrayPaginator = void 0;
const index_1 = __importDefault(require("./index"));
class StaticArrayPaginator {
    constructor(api, user, pageSize = 10) {
        this.currentIndex = 0;
        this.dataArray = [];
        this.algo = new index_1.default(api, user);
        this.pageSize = pageSize;
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dataArray.length == 0) {
                this.dataArray = yield this.algo.getFeed();
            }
            const data = [];
            let hasNextPage = false;
            const startIndex = this.currentIndex;
            const endIndex = this.currentIndex + this.pageSize;
            const currentData = this.dataArray.slice(startIndex, endIndex);
            currentData.forEach((item) => data.push(item));
            if (endIndex < this.dataArray.length) {
                hasNextPage = true;
            }
            this.currentIndex += this.pageSize;
            return {
                done: !hasNextPage,
                value: data
            };
        });
    }
    [Symbol.asyncIterator]() {
        return this;
    }
}
exports.StaticArrayPaginator = StaticArrayPaginator;
