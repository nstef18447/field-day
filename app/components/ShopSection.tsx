import { getProducts } from "@/lib/products";
import { getVariantsByProductId } from "@/lib/variants";
import ProductCard from "./ProductCard";

export default async function ShopSection() {
  const products = await getProducts();

  // For products without images, try to get the first variant photo
  const fallbackImages: Record<number, string> = {};
  for (const product of products) {
    if (!product.images || product.images.length === 0) {
      const variants = await getVariantsByProductId(product.id);
      if (variants.length > 0 && variants[0].photo) {
        fallbackImages[product.id] = variants[0].photo;
      }
    }
  }

  return (
    <section className="shop-section" id="shop">
      <h2 className="section-title reveal">Shop</h2>
      <p className="section-subtitle reveal">handmade keepsakes for every milestone</p>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            fallbackImage={fallbackImages[product.id]}
          />
        ))}
      </div>
    </section>
  );
}
