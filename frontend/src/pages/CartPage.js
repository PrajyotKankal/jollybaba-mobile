import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  const handleEnquiry = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const baseUrl = 'http://localhost:3000'; // Replace in production
   const message = `Hello, I’m interested in the following mobiles:\n\n${cart
  .map(
    (item, index) =>
      `${index + 1}. ${item.brand} ${item.model} (ID: ${item.mobileId}) (${item.ram}/${item.storage}) – ₹${item.price}\nhttp://localhost:3000/mobile/${item._id}`
  )
  .join('\n\n')}`;


    const phoneNumber = '917020708747';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="cart-page">
      <h2>Your Enquiry Cart <span>({cart.length}/20)</span></h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty. Add some mobiles to proceed.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item, index) => (
            <div className="cart-item" key={item._id}>
              <div className="remove-top">
                <button onClick={() => removeFromCart(item._id)} aria-label="Remove item from cart">
                  Remove
                </button>
              </div>

              <Link to={`/mobile/${item._id}`} className="cart-link">
                <img src={item.imageUrls?.[0] || '/no-image.png'} alt={item.model} />
                <div className="info">
                  <h4>{item.brand} {item.model}</h4>
                  <p>{item.ram} / {item.storage}</p>
                  <p>₹{item.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-footer">
          <button className="enquiry-button" onClick={handleEnquiry}>
            📩 Send Enquiry via WhatsApp
          </button>
        </div>
      )}

    </div>
  );
};

export default CartPage;
