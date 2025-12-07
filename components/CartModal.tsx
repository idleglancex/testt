import React from 'react';
import { X } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onRemove, onUpdateQuantity }) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (89.00 * item.quantity), 0);
  const tax = 45.00;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="modal-content bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="bg-gradient-to-r from-[#f9a8d4] to-[#60a5fa] p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-light tracking-wide font-serif">Shopping Cart</h2>
              <p className="text-sm text-white/80 mt-1 font-light">Review your items</p>
            </div>
            <button onClick={onClose} className="hover:scale-110 transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${item.color}, #ffffff)` }}
                  >
                    ITEM
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 font-serif">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">${(89.00 * item.quantity).toFixed(2)}</div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 text-sm mt-2 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto text-gray-300 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center mb-4">
                <X className="w-10 h-10" />
              </div>
              <p className="text-gray-500">Your cart is empty</p>
              <button onClick={onClose} className="mt-4 px-6 py-2 bg-gradient-to-r from-[#60a5fa] to-[#f9a8d4] text-white rounded-lg hover:shadow-lg transition">
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-xl text-[#60a5fa]">${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-[#60a5fa] to-[#f9a8d4] text-white py-3 rounded-lg font-medium hover:shadow-lg transition">
              Proceed to Checkout
            </button>
            <button onClick={onClose} className="w-full mt-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};