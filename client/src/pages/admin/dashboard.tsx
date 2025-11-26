import { useState } from "react";
import { useLocation } from "wouter";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { ProductManagement } from "@/components/admin/product-management";
import { ConfigurationPanel } from "@/components/admin/configuration-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Settings, LogOut, ShoppingBag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAdminAuth } from "@/lib/auth";

type ViewType = "products" | "config";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [currentView, setCurrentView] = useState<ViewType>("products");
  const { isLoading, isAuthenticated } = useAdminAuth();

  const handleLogout = async () => {
    await apiRequest("POST", "/api/admin/logout", {});
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-bold flex items-center gap-2 px-2 py-4">
                <ShoppingBag className="h-5 w-5" />
                Admin Panel
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setCurrentView("products")}
                      isActive={currentView === "products"}
                      data-testid="button-nav-products"
                    >
                      <Package className="h-4 w-4" />
                      <span>Productos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setCurrentView("config")}
                      isActive={currentView === "config"}
                      data-testid="button-nav-config"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Configuración</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-xl font-bold">
                {currentView === "products" ? "Gestión de Productos" : "Configuración"}
              </h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-muted/20">
            {currentView === "products" && <ProductManagement />}
            {currentView === "config" && <ConfigurationPanel />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
