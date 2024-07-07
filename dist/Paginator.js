"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForYouPaginator {
    data;
    currentIndex;
    direction;
    constructor(data) {
        this.data = data;
        this.currentIndex = 0;
        this.direction = "next";
    }
    return(value) {
        throw new Error(`Method not implemented. ${value}`);
    }
    [Symbol.asyncIterator]() {
        throw new Error("Method not implemented.");
    }
    then(onfulfilled, onrejected) {
        throw new Error(`Method not implemented. ${onfulfilled} ${onrejected}`);
    }
    async next() {
        if (this.currentIndex < this.data.length) {
            const result = this.data.slice(this.currentIndex, this.currentIndex + 10);
            this.currentIndex += 10;
            return { value: result, done: false };
        }
        return { value: undefined, done: true };
    }
    getDirection() {
        return this.direction;
    }
    setDirection(direction) {
        this.direction = direction;
        return this;
    }
    clone() {
        const clonedPaginator = new ForYouPaginator(this.data);
        clonedPaginator.currentIndex = this.currentIndex;
        return clonedPaginator;
    }
    async throw(e) {
        console.error(e);
        return { value: undefined, done: true };
    }
    async *values() {
        for (const status of this.data) {
            yield [status];
        }
    }
}
exports.default = ForYouPaginator;
