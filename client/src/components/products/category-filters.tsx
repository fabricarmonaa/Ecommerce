import { type Product } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedSizes: string[];
  onSizesChange: (sizes: string[]) => void;
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
  products: Product[];
}

export function CategoryFilters({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedSizes,
  onSizesChange,
  selectedColors,
  onColorsChange,
  products,
}: CategoryFiltersProps) {
  const categories = Array.from(new Set(products.map(p => p.category)));
  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes)));
  const allColors = Array.from(new Set(products.flatMap(p => p.colors)));

  const maxPrice = Math.max(...products.map(p => parseFloat(p.price)), 1000);

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter(s => s !== size));
    } else {
      onSizesChange([...selectedSizes, size]);
    }
  };

  const handleColorToggle = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorsChange(selectedColors.filter(c => c !== color));
    } else {
      onColorsChange([...selectedColors, color]);
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3 uppercase tracking-wide">Categoría</h3>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "ghost"}
              className="w-full justify-start"
              size="sm"
              onClick={() => onCategoryChange("all")}
              data-testid="button-category-all"
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                className="w-full justify-start"
                size="sm"
                onClick={() => onCategoryChange(category)}
                data-testid={`button-category-${category}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-3 uppercase tracking-wide">Precio</h3>
          <div className="space-y-4">
            <Slider
              min={0}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              data-testid="slider-price"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {allSizes.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-3 uppercase tracking-wide">Talle</h3>
              <div className="space-y-2">
                {allSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={() => handleSizeToggle(size)}
                      data-testid={`checkbox-size-${size}`}
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {allColors.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-3 uppercase tracking-wide">Color</h3>
              <div className="space-y-2">
                {allColors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={() => handleColorToggle(color)}
                      data-testid={`checkbox-color-${color}`}
                    />
                    <Label
                      htmlFor={`color-${color}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
