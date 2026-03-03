import { getProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

export default async function ShopSection() {
  const products = await getProducts();

  return (
    <section className="shop-section" id="shop">
      <h2 className="section-title reveal">Shop</h2>
      <p className="section-subtitle reveal">handmade keepsakes for every milestone</p>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
