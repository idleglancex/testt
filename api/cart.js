// In-memory storage for Vercel (ephemeral, resets on cold start)
let cart = [];

export default function handler(req, res) {
    // CORS headers are handled by Vercel automatically for same-origin,
    // but explicitly setting them doesn't hurt for clarity or specific setups.

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const method = req.method;

    // GET /api/cart
    if (method === 'GET') {
        return res.status(200).json(cart);
    }

    // POST /api/cart
    if (method === 'POST') {
        const item = req.body;
        if (!item || !item.id) {
            return res.status(400).json({ error: 'Invalid item structure' });
        }

        const existingItemIndex = cart.findIndex((i) => i.id === item.id);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + (item.quantity || 1);
        } else {
            cart.push({ ...item, quantity: item.quantity || 1 });
        }
        return res.status(200).json(cart);
    }

    // PUT /api/cart?id=... (Query param approach is easier for Vercel dynamic routes without [id].js if we want single file)
    // BUT local server uses /cart/:id. 
    // To keep parity, let's look at how Vercel handles paths.
    // Standard Vercel function `api/cart.js` handles `/api/cart`.
    // Sub-paths like `/api/cart/123` need `api/cart/[id].js` OR we can parse the URL here if we use a catch-all `api/cart/[[...path]].js`.

    // SIMPLIFICATION: We will change the architecture slightly to pass ID in body or query for update/delete to keep it single-file simple,
    // OR we just parse the ID from the end of the URL manually if possible. 
    // req.query might have it if configured, but let's stick to strict method+body/query for robust single-file handler.

    // HOWEVER, frontend calls `DELETE /cart/${id}`.
    // We can grab the ID from the URL tail.

    // NOTE: Vercel "Serverless Functions" (Next.js style) vs "Vercel Functions" (standalone). 
    // In pure Vite + Vercel, `api/cart.js` maps to `/api/cart`. 
    // It does NOT match `/api/cart/123` by default unless configured in `vercel.json` rewrites.

    // STRATEGY: Update `cartService.ts` to use Query Params or Body for ID to avoid routing complexity.
    // DELETE /api/cart?id=123
    // PUT /api/cart (with body { id, quantity })

    if (method === 'PUT') {
        // Expecting ID in body to keep it simple or query
        const { id, quantity } = req.body; // or req.query
        // Fallback to query if body id is missing (for parity check)
        const targetId = id || req.query.id;

        if (!targetId || quantity === undefined) {
            // Try parsing from url if needed? No, let's enforce modifying the service.
            return res.status(400).json({ error: 'ID and Quantity required' });
        }

        const index = cart.findIndex((i) => i.id === targetId);
        if (index > -1) {
            if (quantity <= 0) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = quantity;
            }
            return res.status(200).json(cart);
        }
        return res.status(404).json({ error: 'Item not found' });
    }

    if (method === 'DELETE') {
        const { id } = req.query; // Expecting ?id=...
        // Note: Standard DELETE often puts ID in path, but query is easier for single-function API without routing framework.

        // If the service sends DELETE /api/cart/123, this handler WONT receive it by default without rewrites.
        // So updating Service to `DELETE /api/cart?id=123` is the smartest move for this quick-win.

        if (!id) return res.status(400).json({ error: 'ID required' });

        const newCart = cart.filter((i) => i.id !== id);
        cart = newCart; // Reassign
        return res.status(200).json(cart);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
