// src/pages/CartPage.jsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { UserTypeContext } from '../context/UserTypeContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

// Build an absolute URL from a path using whatever domain the site is on
const makeAbsolute = (path) =>
  typeof window !== 'undefined'
    ? new URL(path, window.location.origin).href
    : path;

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalItems } = useContext(CartContext);
  const { userType } = useContext(UserTypeContext);

  const getItemPrice = (item) =>
    userType === 'Dealer' ? Number(item.dealerPrice) : Number(item.retailPrice);

  // Calculate total price based on user type and quantity
  const totalPrice = cart.reduce((sum, item) => {
    const price = getItemPrice(item);
    const qty = item.quantity || 1;
    return sum + (Number.isFinite(price) ? price * qty : 0);
  }, 0);

  const handleEnquiry = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Always use canonical long URL for each product
    const links = cart.map((item) => makeAbsolute(`/mobile/${item._id}`));

    const lines = [];
    lines.push(`Hello, I'm interested in the following mobiles:\n`);
    cart.forEach((item, idx) => {
      const price = getItemPrice(item);
      const qty = item.quantity || 1;
      const priceStr = Number.isFinite(price) ? price.toLocaleString('en-IN') : '-';
      const totalItemPrice = Number.isFinite(price) ? (price * qty).toLocaleString('en-IN') : '-';
      lines.push(
        `${idx + 1}. ${item.brand} ${item.model} (ID: ${item.mobileId || '-'}) (${item.ram}/${item.storage})\n` +
        `   Qty: ${qty} × ₹${priceStr} = ₹${totalItemPrice}\n` +
        `   🔗 ${links[idx]}`
      );
    });
    lines.push(`\nTotal Items: ${totalItems}`);
    lines.push(`Total Price: ₹${totalPrice.toLocaleString('en-IN')}`);

    const message = lines.join('\n\n');
    const phoneNumber = '917891011841'; // your business number (no '+')
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="cart-page">
      <h2>
        Your Enquiry Cart <span>({totalItems} items, {cart.length}/20 products)</span>
      </h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty. Add some mobiles to proceed.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => {
              const qty = item.quantity || 1;
              const itemPrice = getItemPrice(item);
              const itemTotal = Number.isFinite(itemPrice) ? itemPrice * qty : 0;

              return (
                <div className="cart-item" key={item._id}>
                  <div className="remove-top">
                    <button onClick={() => removeFromCart(item._id)} aria-label="Remove item from cart">
                      Remove
                    </button>
                  </div>

                  <Link to={`/mobile/${item._id}`} className="cart-link">
                    <img src={item.imageUrls?.[0] || '/no-image.png'} alt={item.model} />
                    <div className="info">
                      <h4>
                        {item.brand} {item.model}
                      </h4>
                      <p>
                        {item.ram} / {item.storage}
                      </p>
                    </div>
                  </Link>

                  {/* Quantity Controls */}
                  <div className="cart-item-quantity">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, qty - 1)}
                      disabled={qty <= 1}
                    >
                      −
                    </button>
                    <span className="qty-value">{qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, qty + 1)}
                      disabled={qty >= 99}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <strong>₹{itemTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-footer">
            <div className="total-price">
              <strong>Total ({totalItems} items): </strong> ₹{totalPrice.toLocaleString('en-IN')}
            </div>
            <button className="enquiry-button" onClick={handleEnquiry}>
              Send Enquiry
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
