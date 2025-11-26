import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

interface HeaderProps {
  onCartClick: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function Header({ onCartClick, onSearch, searchQuery }: HeaderProps) {
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-xl hover-elevate px-2 py-1 rounded-md transition-all" 
            data-testid="link-home"
          >
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">Indumentaria</span>
          </Link>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartClick}
            data-testid="button-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                data-testid="badge-cart-count"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>

        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              data-testid="input-search-mobile"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
