import { Product, PaginatedResponse } from '../types/Product';

const API_BASE = 'http://localhost:3000/api';

/**
 * Fetch products from the API with optional filtering and pagination
 *
 * @param query - Optional substring to filter by product name
 * @param inStock - Optional boolean to filter by stock status
 * @param page - Optional page number (defaults to 1)
 * @returns Promise resolving to paginated response with products and pagination info
 */
export async function fetchProducts(
  query?: string,
  inStock?: boolean,
  page?: number
): Promise<PaginatedResponse> {
  const params = new URLSearchParams();

  if (query) {
    params.append('query', query);
  }

  if (inStock !== undefined) {
    params.append('inStock', String(inStock));
  }

  if (page !== undefined) {
    params.append('page', String(page));
  }

  const url =
    params.toString().length > 0
      ? `${API_BASE}/products?${params.toString()}`
      : `${API_BASE}/products`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a new product
 *
 * @param name - Product name (required, cannot be empty/whitespace)
 * @param price - Product price (required, must be positive)
 * @param inStock - Whether the product is in stock
 * @returns Promise resolving to the created product
 */
export async function createProduct(
  name: string,
  price: number,
  inStock: boolean
): Promise<Product> {
  // TODO: Implement createProduct
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, price, inStock }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create product');
  }

  return response.json();
}
/**
 * Toggle the saved status of a product
 *
 * @param productId - The product ID to toggle
 * @returns Promise resolving to the updated product
 */
export async function toggleSaved(productId: number): Promise<Product> {
  // TODO: Implement toggleSaved
  const response = await fetch(`${API_BASE}/products/${productId}/saved`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle saved');
    }

    return response.json();
  }

/**
 * Delete a product
 *
 * @param productId - The product ID to delete
 * @returns Promise resolving when deletion is complete
 */
export async function deleteProduct(productId: number): Promise<void> {
  // TODO: Implement deleteProduct
  // Make a DELETE request to /api/products/:id
  // Handle errors (product not found, etc.)
  throw new Error('Not implemented yet');
}
