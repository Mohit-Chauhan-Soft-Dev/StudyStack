import { useEffect, useState } from 'react';
import { Dialog, Button, Box, Typography, Stack, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';

export default function PaymentModal({ open, note, onClose }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!open) return;

    if (window.Razorpay) return;

    const existingScript = document.getElementById('razorpay-checkout-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [open]);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.getElementById('razorpay-checkout-script');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-checkout-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!note) return;

    setLoading(true);
    try {
      await loadRazorpayScript();

      const order = await paymentService.createOrder(note.id);

      console.log('Order created:', order);

      const userData = await userService.getUserByEmail(user.sub);

      const options = {
        key: order.keyId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        order_id: order.orderId,
        name: 'StudyStack',
        description: note.title,
        handler: async function (response) {
          try {

            const res = await paymentService.paymentCallback({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });

            console.log(res);

            toast.success("Payment Successful");
            onClose();

          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: userData?.name || 'John Doe',
          email: userData?.email || 'user@example.com',
        },
        theme: {
          color: '#7c3aed',
        },
      };

      if (window.Razorpay) {
        new window.Razorpay(options).open();
      } else {
        toast.error('Razorpay could not be initialized');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.response?.data || error?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <Box sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Purchase &quot;{note?.title}&quot;
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You&apos;ll get instant access once payment is confirmed.
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2, bgcolor: 'rgba(124,58,237,0.06)', borderRadius: 3, mb: 3 }}
        >
          <Typography variant="body2" color="text.secondary">
            Amount payable &nbsp;
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
            ₹{note?.price}
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" fullWidth onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </Box>

        <Divider sx={{ my: 2.5 }} />
        <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center">
          <LockOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Secured by Razorpay
          </Typography>
        </Stack>
      </Box>
    </Dialog>
  );
}