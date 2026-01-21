import { Router, Request, Response } from 'express';
import { products, getNextId } from '../data/store.js';
import { Product, PaginatedResponse } from '../types/Product.js';

const router = Router();

/**
 * GET /api/products
 * Returns a paginated list of products with optional filtering
 *
 * Query parameters:
 * - query: string (optional) - Filter by name substring, case-insensitive
 * - inStock: boolean (optional) - Filter by inStock status
 * - page: number (optional) - Page number, defaults to 1
 * - limit: number (optional) - Items per page, defaults to 10, max 100
 *
 * Results are sorted by id ascending
 */
router.get('/', (req: Request, res: Response) => {
  const { query, inStock } = req.query;

  // Parse pagination params with defaults and bounds
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;

  // Ensure page is at least 1
  if (page < 1) page = 1;

  // Ensure limit is between 1 and 100
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100;

  let filtered = [...products]; // Create a copy to avoid modifying original

  // Filter by name query (case-insensitive substring match)
  if (query && typeof query === 'string' && query.trim()) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by inStock
  if (inStock !== undefined) {
    const inStockBool = inStock === 'true';
    filtered = filtered.filter((p) => p.inStock === inStockBool);
  }

  // Sort by id ascending
  filtered.sort((a, b) => a.id - b.id);

  // Calculate pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filtered.slice(startIndex, endIndex);
  const hasMore = page < totalPages;

  const response: PaginatedResponse = {
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore,
    },
  };

  res.json(response);
});

/**
 * POST /api/products
 * Creates a new product
 *
 * Request body:
 * - name: string (required, cannot be empty/whitespace)
 * - price: number (required, must be positive)
 * - inStock: boolean (required)
 *
 * Defaults:
 * - id: auto-generated
 * - saved: false
 */
router.post('/', (req: Request, res: Response) => {
  const { name, price, inStock } = req.body;

  // TODO: Implement POST logic
  // Check that name is provided and not just whitespace
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and cannot be empty' });
  }

  // Check that price is a positive number
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  // Create new product with auto-generated id and saved=false
  const newProduct: Product = {
    id: getNextId(),
    name: name.trim(),
    price: price,
    inStock: Boolean(inStock),
    saved: false,
  };

  // Add to products array
  products.push(newProduct);

  // Return the created product or error response
  return res.status(201).json(newProduct);
});

/**
 * PATCH /api/products/:id/saved
 * Toggles the 'saved' field for a product
 *
 * Response:
 * - If product exists: return updated product with flipped saved value
 * - If product does not exist: return error response
 */
router.patch('/:id/saved', (req: Request, res: Response) => {
  // TODO: Implement PATCH logic
  // Parse id from params
  const id = parseInt(req.params.id);

  // Find product with that id
  const product = products.find(p => p.id === id);

  // If not found: return error response (CHECK FIRST!)
  if (!product) {
    return res.status(404).json({error: 'Product not found'});
  }

  // If found: flip saved, return updated product (THEN do this)
  product.saved = !product.saved;

  return res.json(product);
});



/**
 * DELETE /api/products/:id
 * Deletes a product
 *
 * Response:
 * - If product exists: delete it, return success response
 * - If product does not exist: return error response
 */
router.delete('/:id', (req: Request, res: Response) => {
  // TODO: Implement DELETE logic
  // Parse id from params
  const id = parseInt(req.params.id);

  // Find product with that id
  const productIndex = products.findIndex(p => p.id === id);

  // If not found: return error response
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // If found: remove from array, return success message
  products.splice(productIndex, 1);

  return res.json({ message: 'Product deleted successfully' });
});

export default router;
