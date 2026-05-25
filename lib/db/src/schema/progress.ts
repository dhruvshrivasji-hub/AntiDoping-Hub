import { pgTable, serial, integer, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  moduleSlug: varchar("module_slug", { length: 100 }).notNull(),
  completed: boolean("completed").default(false),
  score: integer("score").default(0),
  completedAt: timestamp("completed_at"),
});

export const testRecordsTable = pgTable("test_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  testDate: varchar("test_date", { length: 20 }).notNull(),
  status: varchar("status", { length: 50 }).default("clean"),
  location: varchar("location", { length: 255 }),
  notes: varchar("notes", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  roleTarget: varchar("role_target", { length: 50 }).default("all"),
});

export type Progress = typeof progressTable.$inferSelect;
export type TestRecord = typeof testRecordsTable.$inferSelect;
export type Module = typeof modulesTable.$inferSelect;
