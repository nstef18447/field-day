import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { getVariantsByProductId } from "@/lib/variants";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductDetailActions from "@/app/components/ProductDetailActions";
import ProductCustomizer from "@/app/components/ProductCustomizer";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return notFound();

  const isComingSoon = product.badge === "Coming Soon";
  const variants = await getVariantsByProductId(product.id);
  const hasCustomizer = variants.length > 0;

  if (!isComingSoon && hasCustomizer) {
    // Full-width customizer layout replaces the default two-column grid
    return (
      <>
        <Navbar />
        <div className="product-detail-page">
          {product.badge && (
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
              <span className="badge" style={{
                display: "inline-block",
                background: "#c97a4a",
                color: "#fff",
                fontFamily: '"Caveat Brush", cursive',
                fontSize: "0.85rem",
                padding: "4px 14px",
                borderRadius: 20,
              }}>
                {product.badge}
              </span>
            </div>
          )}
          <ProductCustomizer product={product} />
        </div>
        <Footer />
      </>
    );
  }

  const price = `$${(product.price_cents / 100).toFixed(2)}`;

  return (
    <>
      <Navbar />
      <div className="product-detail-page">
        <div className="product-detail-container">
          {/* Image */}
          <div className="product-detail-image">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="product-detail-img" />
            ) : (
              <span className="product-emoji" style={{ fontSize: "6rem" }}>🏷️</span>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            {product.badge && <span className="badge">{product.badge}</span>}
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-price">{isComingSoon ? "Coming Soon" : price}</p>
            <p className="product-detail-desc">{product.description}</p>

            {!isComingSoon && <ProductDetailActions product={product} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
