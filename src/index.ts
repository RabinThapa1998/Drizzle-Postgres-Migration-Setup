import express from 'express';

import { dbClient } from './database/db';
import { drizzle } from 'drizzle-orm/node-postgres';
import { NewUser, users } from './database/schema';
import bodyParser from 'body-parser';

const app = express();

const port = 3000;

var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);

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

dbClient.connect().then(() => {
    console.log('database connected');

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
