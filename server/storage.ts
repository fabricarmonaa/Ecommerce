import { products, admins, configuration, type Product, type InsertProduct, type Admin, type InsertAdmin, type Configuration, type InsertConfiguration } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

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
    const productData = { id: crypto.randomUUID(), ...insertProduct };

    await db.insert(products).values(productData);

    return (await this.getProduct(productData.id))!;
  }

  async updateProduct(id: string, insertProduct: InsertProduct): Promise<Product | undefined> {
    await db
      .update(products)
      .set(insertProduct)
      .where(eq(products.id, id));

    return await this.getProduct(id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const product = await this.getProduct(id);
    if (!product) return false;

    await db.delete(products).where(eq(products.id, id));
    return true;
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
    const adminData = { id: crypto.randomUUID(), ...insertAdmin };

    await db.insert(admins).values(adminData);

    return (await this.getAdmin(adminData.id))!;
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
      await db
        .update(configuration)
        .set({ value })
        .where(eq(configuration.key, key));

      return (await this.getConfigurationByKey(key))!;
    } else {
      const configData = { id: crypto.randomUUID(), key, value };

      await db
        .insert(configuration)
        .values(configData);

      return configData;
    }
  }
}

export const storage = new DatabaseStorage();
