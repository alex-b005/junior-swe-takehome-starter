import { describe, it, expect, beforeEach } from 'vitest';
import { products } from './data/store.js';

/**
 * Example tests for the Products API
 *
 * This shows one complete test pattern. You should add at least 2 more tests
 * covering validation cases and edge cases for your endpoints.
 */

describe('GET /api/products', () => {
  beforeEach(() => {
    // Reset products to known state before each test
    // In a real app, you might use a database fixture or seed data
    products.length = 0;
    products.push(
      {
        id: 1,
        name: 'Blue T-Shirt',
        price: 19.99,
        inStock: true,
        saved: false,
      },
      {
        id: 2,
        name: 'Red Sneakers',
        price: 59.99,
        inStock: true,
        saved: true,
      },
      {
        id: 3,
        name: 'White Shirt',
        price: 24.99,
        inStock: false,
        saved: false,
      }
    );
  });

  it('should filter products by query parameter (happy path)', () => {
    // This is a happy path test - the basic expected behavior
    // You can test the filtering logic directly against the data

    const query = 'shirt';
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    // "shirt" should match both "Blue T-Shirt" and "White Shirt"
    expect(filtered).toHaveLength(2);
    expect(filtered.map((p) => p.name)).toEqual(
      expect.arrayContaining(['Blue T-Shirt', 'White Shirt'])
    );
  });

  it('should paginate results correctly', () => {
    // Test pagination logic
    const page = 1;
    const limit = 2;
    const total = products.length;
    const totalPages = Math.ceil(total / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Page 1 with limit 2 should return first 2 products
    expect(paginatedProducts).toHaveLength(2);
    expect(paginatedProducts[0].id).toBe(1);
    expect(paginatedProducts[1].id).toBe(2);

    // Check pagination metadata
    expect(total).toBe(3);
    expect(totalPages).toBe(2);
    expect(page < totalPages).toBe(true); // hasMore
  });

  // ============================================================
  // TODO: Add at least 2 more tests for YOUR implementations
  // ============================================================
  //
  // The examples above test code that's already implemented for you.
  // Your tests should cover the endpoints YOU implement.
  //
  // IDEAS FOR WHAT TO TEST:
  //
  // POST /api/products (validation):
  //   - What happens when name is empty or whitespace?
  //   - What happens when price is negative or zero?
  //   - Does a valid product get created correctly?
  //
  // PATCH /api/products/:id/saved:
  //   - Does toggling saved work correctly?
  //   - What happens when the product ID doesn't exist?
  //
  // DELETE /api/products/:id:
  //   - Does deleting a product remove it?
  //   - What happens when the product ID doesn't exist?
  //
  // Pagination edge cases:
  //   - What if page exceeds total pages?
  //   - What if page is 0 or negative?
  //
  // ------------------------------------------------------------
  // ANY OF THESE TESTING APPROACHES ARE ACCEPTABLE:
  // ------------------------------------------------------------
  //
  // 1. Unit tests of logic/validation (like the examples above)
  //    - Test filtering, validation rules, pagination math directly
  //    - Extract helper functions and test them
  //
  // 2. Handler-level tests
  //    - Import route handlers and test them with mock req/res
  //
  // 3. Endpoint tests with supertest (bonus, not required)
  //    - Full HTTP integration tests
  //
  // We care about your THINKING behind test selection, not the
  // specific technique. Pick the approach you're comfortable with.
  // ------------------------------------------------------------

  // Test 1: POST Validation rejects empty name (Whitespace)
  it('should reject product with empty name', () => {
    const name = '   ';
    const isNameInvalid = !name || typeof name !== 'string' || name.trim() === '';

    expect(isNameInvalid).toBe(true);
  });

  // Test 2: POST validation rejects negative price (Negative or Zero)
  it('should reject product with negative price', () => {
    const price = -10;
    const isPriceInvalid = typeof price !== 'number' || price <= 0;

    expect(isPriceInvalid).toBe(true);
  });

});
