const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const CART_FILE = path.join(__dirname, 'cart.json');

// Helper to read body
const getBody = (req) => {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(body ? JSON.parse(body) : {});
        });
    });
};

// Helper for CORS
const setCorsHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Database helpers
const readCart = () => {
    try {
        if (!fs.existsSync(CART_FILE)) return [];
        const data = fs.readFileSync(CART_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeCart = (cart) => {
    fs.writeFileSync(CART_FILE, JSON.stringify(cart, null, 2));
};

const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;
    const pathName = url.pathname;

    // GET /cart
    if (method === 'GET' && pathName === '/cart') {
        const cart = readCart();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cart));
        return;
    }

    // POST /cart
    if (method === 'POST' && pathName === '/cart') {
        try {
            const item = await getBody(req);
            if (!item || !item.id) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid item structure' }));
                return;
            }

            const cart = readCart();
            const existingItemIndex = cart.findIndex((i) => i.id === item.id);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + (item.quantity || 1);
            } else {
                cart.push({ ...item, quantity: item.quantity || 1 });
            }

            writeCart(cart);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(cart));
        } catch (e) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // PUT /cart/:id
    if (method === 'PUT' && pathName.startsWith('/cart/')) {
        const id = pathName.split('/').pop();
        try {
            const { quantity } = await getBody(req);

            let cart = readCart();
            const index = cart.findIndex((i) => i.id === id);

            if (index > -1) {
                if (quantity !== undefined) {
                    if (quantity <= 0) {
                        cart.splice(index, 1);
                    } else {
                        cart[index].quantity = quantity;
                    }
                    writeCart(cart);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(cart));
                } else {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Quantity required' }));
                }
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Item not found' }));
            }
        } catch (e) {
            res.writeHead(500);
            res.end();
        }
        return;
    }

    // DELETE /cart/:id
    if (method === 'DELETE' && pathName.startsWith('/cart/')) {
        const id = pathName.split('/').pop();
        let cart = readCart();
        const newCart = cart.filter((i) => i.id !== id);

        if (cart.length !== newCart.length) {
            writeCart(newCart);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newCart));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Item not found' }));
        }
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
