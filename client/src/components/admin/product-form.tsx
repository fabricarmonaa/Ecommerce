import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { type Product, type InsertProduct, insertProductSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const { toast } = useToast();
  const isEditing = !!product;

  const [images, setImages] = useState<string[]>(product?.images || []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [newImage, setNewImage] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "0",
      category: product?.category || "",
      stock: product?.stock || 0,
      featured: product?.featured || false,
      images: product?.images || [],
      sizes: product?.sizes || [],
      colors: product?.colors || [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const url = isEditing ? `/api/products/${product.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: isEditing ? "Producto actualizado" : "Producto creado",
        description: `El producto se ${isEditing ? "actualizó" : "creó"} correctamente`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `No se pudo ${isEditing ? "actualizar" : "crear"} el producto`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    mutation.mutate({
      ...data,
      images,
      sizes,
      colors,
    });
  };

  const addImage = () => {
    if (newImage && !images.includes(newImage)) {
      setImages([...images, newImage]);
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{isEditing ? "Editar" : "Nuevo"} Producto</CardTitle>
            <CardDescription>
              {isEditing ? "Actualiza" : "Crea"} la información del producto
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-form">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Ej: Remera de Algodón"
                data-testid="input-name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Input
                id="category"
                {...form.register("category")}
                placeholder="Ej: Remeras"
                data-testid="input-category"
              />
              {form.formState.errors.category && (
                <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Descripción detallada del producto"
              rows={4}
              data-testid="input-description"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                type="text"
                {...form.register("price")}
                placeholder="99.99"
                data-testid="input-price"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                {...form.register("stock", { valueAsNumber: true })}
                placeholder="0"
                data-testid="input-stock"
              />
              {form.formState.errors.stock && (
                <p className="text-sm text-destructive">{form.formState.errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imágenes (URLs) *</Label>
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                data-testid="input-new-image"
              />
              <Button type="button" onClick={addImage} data-testid="button-add-image">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  Imagen {index + 1}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            {images.length === 0 && (
              <p className="text-sm text-destructive">Agrega al menos una imagen</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Talles *</Label>
            <div className="flex gap-2">
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Ej: M, L, XL"
                data-testid="input-new-size"
              />
              <Button type="button" onClick={addSize} data-testid="button-add-size">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {sizes.map((size) => (
                <Badge key={size} variant="secondary" className="pr-1">
                  {size}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => removeSize(size)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            {sizes.length === 0 && (
              <p className="text-sm text-destructive">Agrega al menos un talle</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Colores *</Label>
            <div className="flex gap-2">
              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Ej: Rojo, Azul, Negro"
                data-testid="input-new-color"
              />
              <Button type="button" onClick={addColor} data-testid="button-add-color">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color) => (
                <Badge key={color} variant="secondary" className="pr-1">
                  {color}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => removeColor(color)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            {colors.length === 0 && (
              <p className="text-sm text-destructive">Agrega al menos un color</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={form.watch("featured")}
              onCheckedChange={(checked) => form.setValue("featured", checked as boolean)}
              data-testid="checkbox-featured"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Producto destacado
            </Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={mutation.isPending || images.length === 0 || sizes.length === 0 || colors.length === 0}
              data-testid="button-save-product"
            >
              {mutation.isPending ? "Guardando..." : isEditing ? "Actualizar" : "Crear"} Producto
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
