// src/components/CartDrawer.js
import React from 'react';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose, cartItems, onInquiry }) => {
  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="cart-body">
        {cartItems.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <>
            {cartItems.map((item, i) => (
              <div key={i} className="cart-item">
                <img src={item.imageUrl} alt={item.model} />
                <div>
                  <h4>{item.brand} {item.model}</h4>
                  <p>{item.ram} / {item.storage}</p>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))}
            <button className="inquiry-btn" onClick={() => onInquiry(cartItems)}>📩 Send WhatsApp Inquiry</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
