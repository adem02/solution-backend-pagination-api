import express from 'express';
import { json } from 'body-parser';
import cors from 'cors'
import {createDatabaseConnection} from "./database/config";
import * as dotenv from 'dotenv';

const app = express();
dotenv.config();
app.use(json());
app.use(cors({
    origin: '*',
    methods: ['GET']
}));

app.get('/api/films', async (req, res) => {
    const connection = await createDatabaseConnection();
    await connection.connect();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = req.query.sort as string || 'title';
    const order = req.query.order as string || 'asc';
    const filter = req.query.filter as string || '';

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

    const films = await connection.query(query);
    res.send(films);
});

app.get('/api/films/count', async (req, res) => {
    const connection = await createDatabaseConnection();
    await connection.connect();

    const query = `
    SELECT COUNT(*) AS count
    FROM film
  `;

    const result = await connection.query(query);
    res.send(result[0]);
});

app.get('/', (req, res) => {
    res.send('Hello');
})

app.listen(process.env.PORT || 3001, () => {
    console.log('Listening on port 3001');
})

export default app;