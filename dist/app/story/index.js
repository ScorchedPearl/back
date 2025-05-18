"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Story = void 0;
const types_1 = require("./types");
const mutation_1 = require("./mutation");
const resolver_1 = require("./resolver");
const query_1 = require("./query");
exports.Story = { types: types_1.types, mutations: mutation_1.mutations, resolvers: resolver_1.resolvers, query: query_1.query };
