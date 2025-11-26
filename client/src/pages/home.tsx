import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { ProductGrid } from "@/components/products/product-grid";
import { CategoryFilters } from "@/components/products/category-filters";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter((product) => {
    const price = parseFloat(product.price);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesSize = selectedSizes.length === 0 || selectedSizes.some(size => product.sizes.includes(size));
    const matchesColor = selectedColors.length === 0 || selectedColors.some(color => product.colors.includes(color));
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesPrice && matchesSize && matchesColor && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCartClick={() => setCartOpen(true)} 
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <main className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar productos. Por favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <CategoryFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedSizes={selectedSizes}
              onSizesChange={setSelectedSizes}
              selectedColors={selectedColors}
              onColorsChange={setSelectedColors}
              products={products || []}
            />
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[3/4] w-full rounded-md" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
