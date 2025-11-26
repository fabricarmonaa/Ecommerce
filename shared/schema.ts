import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  sizes: text("sizes").array().notNull().default(sql`ARRAY[]::text[]`),
  colors: text("colors").array().notNull().default(sql`ARRAY[]::text[]`),
  category: text("category").notNull(),
  stock: integer("stock").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
}).extend({
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number with up to 2 decimal places"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Admins table (no users table - only admins can log in)
export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("ADMIN"),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginAdminSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type LoginAdmin = z.infer<typeof loginAdminSchema>;

// Configuration table (WhatsApp number and other settings)
export const configuration = pgTable("configuration", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertConfigurationSchema = createInsertSchema(configuration).omit({
  id: true,
}).extend({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

export type Configuration = typeof configuration.$inferSelect;
export type InsertConfiguration = z.infer<typeof insertConfigurationSchema>;
