import { relations, sql } from 'drizzle-orm';
import {
    pgTable,
    pgView,
    serial,
    text,
    timestamp,
    integer,
} from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
    id: serial('id'),
    name: text('name'),
    email: text('email'),
    password: text('password'),
    role: text('role').$type<'admin' | 'customer'>(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content'),
    authorId: integer('author_id'),
});

export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));
