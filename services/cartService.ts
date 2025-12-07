import { CartItem } from '../types';

const API_URL = '/api/cart';

export const cartService = {
    async getCart(): Promise<CartItem[]> {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch cart');
        return response.json();
    },

    async addToCart(item: CartItem): Promise<CartItem[]> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error('Failed to add to cart');
        return response.json();
    },

    // Update: Pass ID in body or query. Vercel function handles body.
    async updateCartItem(id: string, quantity: number): Promise<CartItem[]> {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, quantity }),
        });
        if (!response.ok) throw new Error('Failed to update cart item');
        return response.json();
    },

    // Remove: Pass ID in query param
    async removeFromCart(id: string): Promise<CartItem[]> {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to remove from cart');
        return response.json();
    },
};

