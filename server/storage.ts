import { products, admins, configuration, type Product, type InsertProduct, type Admin, type InsertAdmin, type Configuration, type InsertConfiguration } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Admins
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Configuration
  getConfiguration(): Promise<Configuration[]>;
  getConfigurationByKey(key: string): Promise<Configuration | undefined>;
  setConfiguration(key: string, value: string): Promise<Configuration>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: string, insertProduct: InsertProduct): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(insertProduct)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Admins
  async getAdmin(id: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || undefined;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db
      .insert(admins)
      .values(insertAdmin)
      .returning();
    return admin;
  }

  // Configuration
  async getConfiguration(): Promise<Configuration[]> {
    return await db.select().from(configuration);
  }

  async getConfigurationByKey(key: string): Promise<Configuration | undefined> {
    const [config] = await db.select().from(configuration).where(eq(configuration.key, key));
    return config || undefined;
  }

  async setConfiguration(key: string, value: string): Promise<Configuration> {
    const existing = await this.getConfigurationByKey(key);
    
    if (existing) {
      const [config] = await db
        .update(configuration)
        .set({ value })
        .where(eq(configuration.key, key))
        .returning();
      return config;
    } else {
      const [config] = await db
        .insert(configuration)
        .values({ key, value })
        .returning();
      return config;
    }
  }
}

export const storage = new DatabaseStorage();
