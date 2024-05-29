import express from 'express';

import { dbClient } from './database/db';
import { drizzle } from 'drizzle-orm/node-postgres';
import { NewUser, posts, users } from './database/schema';
import * as schema from './database/schema';

import bodyParser from 'body-parser';

const app = express();

const port = 3000;

var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);

app.get('/users', async (req, res) => {
    const db = drizzle(dbClient);
    const result = await db.select().from(users);
    res.status(200).json({ result });
});

app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    const db = drizzle(dbClient);

    const result = await db
        .insert(users)
        .values({
            name,
            email,
            password,
            role: 'customer',
        } as NewUser)
        .returning();

    res.status(200).json({ result });
});

app.get('/posts', async (req, res) => {
    const db = drizzle(dbClient, { schema: schema });
    const result = await db.query.posts.findMany({
        with: {
            author: true,
        },
    });
    res.status(200).json({ result });
});

app.post('/posts', async (req, res) => {
    const { content, authorId } = req.body;
    const db = drizzle(dbClient, { schema: schema });

    const result = await db
        .insert(posts)
        .values({
            content,
            authorId,
        })
        .returning();
    res.status(200).json({ result });
});

dbClient.connect().then(() => {
    console.log('database connected');

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
