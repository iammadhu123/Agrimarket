import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useCart } from '../../context/CartContext';
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
  { value: 'upi', label: 'UPI / NetBanking', icon: '📱' },
  { value: 'card', label: 'Credit / Debit Card', icon: '💳' },
];

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { items, totalPrice } = cart;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  const handleOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Backend expects productId, not product
      const orderData = {
        shippingAddress: address,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      const { data } = await API.post('/orders', orderData);

      await clearCart();

      toast.success('Order placed successfully! 🎉');

      navigate(`/buyer/orders/${data.order._id}`);
    } catch (err) {
      console.error('Order error:', err);

      toast.error(
        err.response?.data?.message || 'Failed to place order'
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/buyer/cart');
    return null;
  }

  return (
    <div>
      <h1
        style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        Checkout
      </h1>

      <form onSubmit={handleOrder}>
        <div className="row g-4">

          {/* LEFT SIDE */}
          <div className="col-lg-7">

            {/* SHIPPING ADDRESS */}
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)',
                padding: '28px',
                marginBottom: 20,
              }}
            >
              <h5
                style={{
                  fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                <FiMapPin
                  style={{
                    color: 'var(--primary)',
                    marginRight: 6,
                  }}
                />
                Shipping Address
              </h5>

              <div className="row g-3">
                {[
                  {
                    label: 'Full Name',
                    key: 'name',
                    placeholder: 'Recipient name',
                    col: 'col-md-6',
                  },
                  {
                    label: 'Phone',
                    key: 'phone',
                    placeholder: '10-digit number',
                    col: 'col-md-6',
                  },
                  {
                    label: 'Street Address',
                    key: 'street',
                    placeholder: 'House no., street, area',
                    col: 'col-12',
                  },
                  {
                    label: 'City',
                    key: 'city',
                    placeholder: 'City',
                    col: 'col-md-4',
                  },
                  {
                    label: 'State',
                    key: 'state',
                    placeholder: 'State',
                    col: 'col-md-4',
                  },
                  {
                    label: 'PIN Code',
                    key: 'pincode',
                    placeholder: '6-digit PIN',
                    col: 'col-md-4',
                  },
                  {
                    label: 'Landmark (Optional)',
                    key: 'landmark',
                    placeholder: 'Near landmark',
                    col: 'col-12',
                  },
                ].map(({ label, key, placeholder, col }) => (
                  <div key={key} className={col}>
                    <label className="form-label-custom">
                      {label}
                    </label>

                    <input
                      type="text"
                      className="form-control-custom"
                      placeholder={placeholder}
                      value={address[key]}
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          [key]: e.target.value,
                        })
                      }
                      required={key !== 'landmark'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)',
                padding: '28px',
              }}
            >
              <h5
                style={{
                  fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                <FiCreditCard
                  style={{
                    color: 'var(--primary)',
                    marginRight: 6,
                  }}
                />
                Payment Method
              </h5>

              <div className="d-flex flex-column gap-3">
                {PAYMENT_METHODS.map(
                  ({ value, label, icon }) => (
                    <label
                      key={value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '16px',
                        borderRadius: 'var(--radius)',
                        border:
                          paymentMethod === value
                            ? '2px solid var(--primary)'
                            : '2px solid var(--gray-200)',
                        background:
                          paymentMethod === value
                            ? 'var(--primary-50)'
                            : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={() =>
                          setPaymentMethod(value)
                        }
                        style={{ display: 'none' }}
                      />

                      <span
                        style={{
                          fontSize: '1.3rem',
                        }}
                      >
                        {icon}
                      </span>

                      <span
                        style={{
                          fontWeight: 600,
                          color:
                            paymentMethod === value
                              ? 'var(--primary)'
                              : 'var(--dark)',
                        }}
                      >
                        {label}
                      </span>

                      {paymentMethod === value && (
                        <FiCheck
                          style={{
                            marginLeft: 'auto',
                            color: 'var(--primary)',
                          }}
                        />
                      )}
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - ORDER SUMMARY */}
          <div className="col-lg-5">
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)',
                padding: '24px',
                position: 'sticky',
                top: 20,
              }}
            >
              <h5
                style={{
                  fontWeight: 800,
                  marginBottom: 16,
                }}
              >
                Order Summary
              </h5>

              <div
                style={{
                  maxHeight: 280,
                  overflowY: 'auto',
                  marginBottom: 16,
                }}
              >
                {items.map((item) => (
                  <div
                    key={item.product._id}
                    className="d-flex align-items-center gap-3 mb-3"
                  >
                    <img
                      src={
                        item.product.images?.[0]?.url || ''
                      }
                      alt=""
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        objectFit: 'cover',
                        background: 'var(--gray-100)',
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
                        {item.product.name}
                      </div>

                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--gray-600)',
                        }}
                      >
                        Qty: {item.quantity}
                      </div>
                    </div>

                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* PRICE SUMMARY */}
              <div
                style={{
                  borderTop: '1px solid var(--gray-200)',
                  paddingTop: 16,
                }}
              >
                <div className="d-flex justify-content-between mb-2">
                  <span
                    style={{
                      color: 'var(--gray-600)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Subtotal
                  </span>

                  <span style={{ fontWeight: 600 }}>
                    ₹{totalPrice}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span
                    style={{
                      color: 'var(--gray-600)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Delivery
                  </span>

                  <span
                    style={{
                      color: 'var(--primary)',
                      fontWeight: 600,
                    }}
                  >
                    FREE
                  </span>
                </div>

                <div
                  className="d-flex justify-content-between mb-4 pt-2"
                  style={{
                    borderTop:
                      '1px solid var(--gray-200)',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                    }}
                  >
                    Total
                  </span>

                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      color: 'var(--primary-dark)',
                    }}
                  >
                    ₹{totalPrice}
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom w-100 justify-content-center"
                  style={{ padding: '13px' }}
                  disabled={loading}
                >
                  {loading
                    ? '⏳ Placing Order...'
                    : '🎉 Place Order'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;