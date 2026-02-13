import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);

  // Optional: Your cart items (from Redux or props)
  const cartItems = [
    // Example data – replace with real data from Redux
    { id: 1, name: 'T-Shirt', price: 29.99, quantity: 2 },
    { id: 2, name: 'Jeans', price: 59.99, quantity: 1 },
  ];

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    // Here you would also update individual item selection state if needed
  };

  return (
    <Container maxWidth="lg" className="py-8">
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom className="font-bold">
        Your Cart
      </Typography>

      {/* Cart Actions (Remove All) */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
            color="primary"
            inputProps={{ 'aria-label': 'Select all items' }}
          />
          <Typography variant="body1">Select All</Typography>
        </div>

        <IconButton color="error" aria-label="remove all">
          <DeleteIcon />
          <Typography variant="body2" className="ml-1">Remove All</Typography>
        </IconButton>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <Typography variant="body1" className="text-center text-gray-500">
            Your cart is empty.
          </Typography>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Checkbox + Image + Details */}
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectAll} // For simplicity – you can make per-item state
                  color="primary"
                />
                <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                  {/* Replace with real image */}
                  <span className="text-gray-500">Image</span>
                </div>
                <div>
                  <Typography variant="subtitle1" className="font-semibold">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </Typography>
                </div>
              </div>

              {/* Price & Remove */}
              <div className="flex items-center space-x-4">
                <Typography variant="h6" className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
                <IconButton color="error" size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subtotal / Checkout */}
      {cartItems.length > 0 && (
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-xs bg-gray-50 p-6 rounded-lg border">
            <div className="flex justify-between mb-4">
              <Typography variant="subtitle1">Subtotal</Typography>
              <Typography variant="h6">
                ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </Typography>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Cart;