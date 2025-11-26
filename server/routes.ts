import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import xss from "xss";
import { storage } from "./storage";
import { insertProductSchema, loginAdminSchema, insertConfigurationSchema } from "@shared/schema";
import { ZodError } from "zod";

const SESSION_SECRET = process.env.SESSION_SECRET || "your-session-secret-change-in-production";

declare module 'express-session' {
  interface SessionData {
    adminId?: string;
    username?: string;
  }
}

// Middleware de autenticación
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ ok: false, message: "Unauthorized - Please log in" });
  }
  next();
}

// Sanitize input to prevent XSS
function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return xss(input);
  } else if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  } else if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  return input;
}

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
      },
    })
  );

  // CORS configuration - strict allowed origins
  app.use((req, res, next) => {
    const allowedOrigins = [
      'http://localhost:5000',
      'http://127.0.0.1:5000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
    ].filter(Boolean) as string[];

    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
    }
    
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Security headers
  app.use((req, res, next) => {
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("X-XSS-Protection", "1; mode=block");
    res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  // ============= ADMIN AUTH ROUTES =============
  
  // Admin login
  app.post("/api/admin/login", loginLimiter, async (req: Request, res: Response) => {
    try {
      const sanitized = sanitizeInput(req.body);
      const { username, password } = loginAdminSchema.parse(sanitized);

      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ ok: false, message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ ok: false, message: "Invalid credentials" });
      }

      req.session.adminId = admin.id;
      req.session.username = admin.username;

      res.json({ ok: true, admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ ok: false, message: "Invalid input", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ ok: false, message: "Logout failed" });
      }
      res.json({ ok: true });
    });
  });

  // Check admin session
  app.get("/api/admin/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const admin = await storage.getAdmin(req.session.adminId!);
      if (!admin) {
        return res.status(404).json({ ok: false, message: "Admin not found" });
      }
      res.json({ ok: true, admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Get admin error:", error);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  });

  // ============= PRODUCT ROUTES (Public reads, Admin writes) =============

  // Get all products (PUBLIC)
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const allProducts = await storage.getProducts();
      res.json(allProducts);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  });

  // Get single product (PUBLIC)
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ ok: false, message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  });

  // Create product (ADMIN ONLY)
  app.post("/api/products", requireAuth, async (req: Request, res: Response) => {
    try {
      const sanitized = sanitizeInput(req.body);
      const validated = insertProductSchema.parse(sanitized);
      
      const product = await storage.createProduct(validated);
      res.status(201).json({ ok: true, product });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ ok: false, message: "Invalid input", errors: error.errors });
      }
      console.error("Create product error:", error);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  });

  // Update product (ADMIN ONLY)
  app.put("/api/products/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const sanitized = sanitizeInput(req.body);
      const validated = insertProductSchema.parse(sanitized);
      
      const product = await storage.updateProduct(req.params.id, validated);
      if (!product) {
        return res.status(404).json({ ok: false, message: "Product not found" });
      }
      res.json({ ok: true, product });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ ok: false, message: "Invalid input", errors: error.errors });
      }
      console.error("Update product error:", error);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  });

  // Delete product (ADMIN ONLY)
  app.delete("/api/products/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ ok: false, message: "Product not found" });
      }
      res.json({ ok: true });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  });

  // ============= CONFIGURATION ROUTES =============

  // Get all configuration (PUBLIC - needed for WhatsApp button)
  app.get("/api/configuration", async (req: Request, res: Response) => {
    try {
      const config = await storage.getConfiguration();
      res.json(config);
    } catch (error) {
      console.error("Get configuration error:", error);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  });

  // Set configuration (ADMIN ONLY)
  app.post("/api/configuration", requireAuth, async (req: Request, res: Response) => {
    try {
      const sanitized = sanitizeInput(req.body);
      const { key, value } = insertConfigurationSchema.parse(sanitized);
      
      const config = await storage.setConfiguration(key, value);
      res.json({ ok: true, config });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ ok: false, message: "Invalid input", errors: error.errors });
      }
      console.error("Set configuration error:", error);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
