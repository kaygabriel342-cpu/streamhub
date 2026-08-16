import { pgTable, text, integer, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar").default('/avatars/default.png'),
  pin: text("pin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchParties = pgTable("watch_parties", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  hostProfileId: uuid("host_profile_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(),
  currentTime: integer("current_time").default(0).notNull(),
  isPlaying: boolean("is_playing").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchPartyMembers = pgTable("watch_party_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  partyId: uuid("party_id").notNull(),
  profileId: uuid("profile_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const watchHistory = pgTable("watch_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(),
  progress: integer("progress").default(0).notNull(),
  duration: integer("duration").default(0).notNull(),
  watchedAt: timestamp("watched_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").notNull(),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const liveChannels = pgTable("live_channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  logo: text("logo"),
  streamUrl: text("stream_url").notNull(),
  category: text("category").default('general'),
  isLive: boolean("is_live").default(true).notNull(),
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
  profile: one(profiles, {
    fields: [watchPartyMembers.profileId],
    references: [profiles.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  watchPartyMembers: many(watchPartyMembers),
  watchHistory: many(watchHistory),
  favorites: many(favorites),
}));

export const watchHistoryRelations = relations(watchHistory, ({ one }) => ({
  profile: one(profiles, {
    fields: [watchHistory.profileId],
    references: [profiles.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  profile: one(profiles, {
    fields: [favorites.profileId],
    references: [profiles.id],
  }),
}));
