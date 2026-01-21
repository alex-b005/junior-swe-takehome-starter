import { useEffect, useState } from 'react';
import { fetchProducts, createProduct, toggleSaved } from './api/products';
import { ProductCard } from './components/ProductCard.js';
import { Product } from './types/Product.js';
import './App.css';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // TODO: Add state for search query
  const [searchQuery, setSearchQuery] = useState('');


  // TODO: Add state for inStock filter
  const [inStockOnly, setInStockOnly] = useState(false);

  // TODO: Add state for current page (for "Load more" functionality)
  const [page, setPage] = useState(1);

  // Fetch initial products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        setPage(1);
        const data = await fetchProducts(searchQuery, inStockOnly || undefined);
        setProducts(data.products);
        setHasMore(data.pagination.hasMore);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load products'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchQuery, inStockOnly]);
  // TODO: Add searchQuery and inStockOnly to dependency array
  // When they change, call fetchProducts with those parameters
  // Remember to reset page to 1 when filters change

  const handleToggleSaved = async (productId: number) => {
    // TODO: Implement handleToggleSaved
    try {
      const updatedProduct = await toggleSaved(productId);
      setProducts(products.map(p =>
          p.id === productId ? updatedProduct : p
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle saved');
    }
  };

  const handleAddProduct = async (
      name: string,
      price: number,
      inStock: boolean
  ) => {
    try {
      const newProduct = await createProduct(name, price, inStock);
      setProducts([...products, newProduct]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
    }
  };

  const handleLoadMore = async () => {
    // TODO: Implement handleLoadMore
    try {
      const nextPage = page + 1;
      const data = await fetchProducts(searchQuery, inStockOnly || undefined, nextPage);
      setProducts([...products, ...data.products]);
      setHasMore(data.pagination.hasMore);
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more');
    }
  };

  return (
      <div className="app">
        <header>
          <h1>Product Catalog</h1>
        </header>

        <main>
          {/* TODO: Add search input field */}
          <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* TODO: Add "In stock only" filter toggle */}
          <label>
            <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In stock only
          </label>

          {/* TODO: Add form to create new products */}
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const name = (form.elements.namedItem('name') as HTMLInputElement).value;
            const price = parseFloat((form.elements.namedItem('price') as HTMLInputElement).value);
            const inStock = (form.elements.namedItem('inStock') as HTMLInputElement).checked;
            handleAddProduct(name, price, inStock);
            form.reset();
          }}>
            <input name="name" type="text" placeholder="Product name" required />
            <input name="price" type="number" placeholder="Price" step="0.01" required />
            <label>
              <input name="inStock" type="checkbox" /> In stock
            </label>
            <button type="submit">Add Product</button>
          </form>

          {/* Error message display */}
          {error && <div className="error-message">{error}</div>}

          {/* Loading state */}
          {loading && <p>Loading products...</p>}

          {/* Empty state */}
          {!loading && products.length === 0 && !error && (
              <p className="empty-state">No products found</p>
          )}

          {/* Product list */}
          {!loading && products.length > 0 && (
              <div className="product-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onToggleSaved={handleToggleSaved}
                    />
                ))}
              </div>
          )}

          {/* TODO: Add "Load more" button */}
          {/* Show this button only when hasMore is true */}
          { hasMore && (
          <button onClick={handleLoadMore} disabled={loading}>
          Load more
        </button>
              )}
        </main>
      </div>
  )};