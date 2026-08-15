import { pgTable, text, integer, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchParties = pgTable("watch_parties", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  hostId: uuid("host_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(), // 'movie' or 'tv'
  currentTime: integer("current_time").default(0).notNull(),
  isPlaying: boolean("is_playing").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchPartyMembers = pgTable("watch_party_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  partyId: uuid("party_id").notNull(),
  userId: uuid("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const watchHistory = pgTable("watch_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(),
  progress: integer("progress").default(0).notNull(),
  watchedAt: timestamp("watched_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const watchPartiesRelations = relations(watchParties, ({ many }) => ({
  members: many(watchPartyMembers),
}));

export const watchPartyMembersRelations = relations(watchPartyMembers, ({ one }) => ({
  party: one(watchParties, {
    fields: [watchPartyMembers.partyId],
    references: [watchParties.id],
  }),
  user: one(users, {
    fields: [watchPartyMembers.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  watchPartyMembers: many(watchPartyMembers),
  watchHistory: many(watchHistory),
  favorites: many(favorites),
}));

export const watchHistoryRelations = relations(watchHistory, ({ one }) => ({
  user: one(users, {
    fields: [watchHistory.userId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));
