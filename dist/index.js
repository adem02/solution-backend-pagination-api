"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./database/config");
const dotenv = __importStar(require("dotenv"));
const app = (0, express_1.default)();
dotenv.config();
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET']
}));
app.get('/api/films', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield (0, config_1.createDatabaseConnection)();
    yield connection.connect();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'title';
    const order = req.query.order || 'asc';
    const filter = req.query.filter || '';
    const query = `
    SELECT f.title, f.rental_rate, f.rating, c.name as category, COUNT(r.rental_id) AS rentals
    FROM film f
    INNER JOIN film_category fc ON f.film_id = fc.film_id
    INNER JOIN category c ON fc.category_id = c.category_id
    LEFT JOIN inventory i ON f.film_id = i.film_id
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id
    WHERE LOWER(f.title) LIKE LOWER('%${filter}%')
    GROUP BY f.film_id
    ORDER BY ${sort} ${order}
    LIMIT ${limit} OFFSET ${(page - 1) * limit}
  `;
    const films = yield connection.query(query);
    res.send(films);
}));
app.get('/api/films/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield (0, config_1.createDatabaseConnection)();
    yield connection.connect();
    const query = `
    SELECT COUNT(*) AS count
    FROM film
  `;
    const result = yield connection.query(query);
    res.send(result[0]);
}));
app.get('/', (req, res) => {
    res.send('Hello');
});
app.listen(process.env.PORT || 3001, () => {
    console.log('Listening on port 3001');
});
exports.default = app;
//# sourceMappingURL=index.js.map