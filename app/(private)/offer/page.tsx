'use client';

import { Add, Remove } from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Card from '@/app/components/Card';
import Button from '@/app/components/Button';
import { useAuth } from '@/app/components/AuthContext';

const formatDisplayName = (username?: string): string => {
  if (!username) return 'Cliente';
  const normalized = username.replace(/^[A-Za-z]{2,10}/, '');
  return normalized ? `Cliente ${normalized}` : username;
};

export default function OfferPage(): React.ReactNode {
  const { user } = useAuth();
  const minAmount = 1751000;
  const maxAmount = 13000000;
  const amountStep = 100000;
  const allowedTerms = [12, 24, 36, 48, 60];
  const minTerm = allowedTerms[0];
  const maxTerm = allowedTerms[allowedTerms.length - 1];

  const [amount, setAmount] = useState(maxAmount);
  const [term, setTerm] = useState(36);
  const [amountInput, setAmountInput] = useState(String(maxAmount));
  const [termInput, setTermInput] = useState('36');

  useEffect(() => {
    // Notify parent iframe host that the offer UI is fully mounted.
    window.parent.postMessage({ type: 'CREDIT_FLOW_READY' }, '*');
  }, []);

  const formatCurrency = (value: number): string => {
    return `$${new Intl.NumberFormat('es-CO').format(value)}`;
  };

  const clamp = (value: number, min: number, max: number): number => {
    return Math.min(max, Math.max(min, value));
  };

  const handleAmountChange = (value: string): void => {
    const digits = value.replace(/\D/g, '');
    setAmountInput(digits);
    if (digits) {
      const parsed = Number(digits);
      if (!Number.isNaN(parsed)) {
        setAmount(clamp(parsed, minAmount, maxAmount));
      }
    }
  };

  const handleAmountBlur = (): void => {
    const parsed = Number(amountInput || minAmount);
    const clamped = clamp(parsed, minAmount, maxAmount);
    setAmount(clamped);
    setAmountInput(String(clamped));
  };

  const handleTermChange = (value: string): void => {
    const digits = value.replace(/\D/g, '');
    setTermInput(digits);
    if (digits) {
      const parsed = Number(digits);
      if (!Number.isNaN(parsed) && allowedTerms.includes(parsed)) {
        setTerm(parsed);
      }
    }
  };

  const handleTermBlur = (): void => {
    const parsed = Number(termInput || term);
    if (allowedTerms.includes(parsed)) {
      setTerm(parsed);
      setTermInput(String(parsed));
      return;
    }

    const nearest = allowedTerms.reduce((closest, current) => {
      return Math.abs(current - parsed) < Math.abs(closest - parsed)
        ? current
        : closest;
    }, allowedTerms[0]);
    setTerm(nearest);
    setTermInput(String(nearest));
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      '& fieldset': {
        borderColor: '#94A3B8',
      },
      '&:hover fieldset': {
        borderColor: '#496374',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#496374',
      },
    },
    '& .MuiInputBase-input': {
      textAlign: 'center',
      fontWeight: 600,
    },
    '& .MuiInputLabel-root': {
      color: '#496374',
    },
  };

  return (
    <Card data-testid="offer-page-card">
      <Box sx={{ maxWidth: 520, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 5 }}>
          Personalizar oferta
        </Typography>

        <Typography variant="h5" sx={{ mb: 1.5 }}>
          {formatDisplayName(user?.username)}, tiene la posibilidad de tomar un
          crédito hasta $13.000.000
        </Typography>

        <Typography variant="body2" sx={{ mb: 2.5 }}>
          Esta es la opción que le da el Banco, si quiere un valor menor,
          modifique monto y plazo.
        </Typography>

        <Box
          sx={{
            mb: 2.5,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: 'rgba(77, 112, 209, 0.15)',
            textAlign: 'left',
          }}
        >
          <Typography variant="body2">
            El monto inicial ofrecido es exclusivo para usted. Al realizar
            cambios en su oferta, la cuota y/o tasa pueden variar.
          </Typography>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="Monto"
          value={amountInput}
          onChange={(e) => handleAmountChange(e.target.value)}
          onBlur={handleAmountBlur}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  onClick={() => {
                    const next = Math.max(minAmount, amount - amountStep);
                    setAmount(next);
                    setAmountInput(String(next));
                  }}
                  disabled={amount <= minAmount}
                >
                  <Remove fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    const next = Math.min(maxAmount, amount + amountStep);
                    setAmount(next);
                    setAmountInput(String(next));
                  }}
                  disabled={amount >= maxAmount}
                >
                  <Add fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ inputMode: 'numeric' }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
            mt: -1,
          }}
        >
          <Typography variant="body2">
            Min. {formatCurrency(minAmount)}
          </Typography>
          <Typography variant="body2">
            Max. {formatCurrency(maxAmount)}
          </Typography>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="Plazo (meses)"
          value={termInput}
          onChange={(e) => handleTermChange(e.target.value)}
          onBlur={handleTermBlur}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  onClick={() => {
                    const currentIndex = allowedTerms.indexOf(term);
                    const nextIndex = Math.max(0, currentIndex - 1);
                    const next = allowedTerms[nextIndex];
                    setTerm(next);
                    setTermInput(String(next));
                  }}
                  disabled={term <= minTerm}
                >
                  <Remove fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    const currentIndex = allowedTerms.indexOf(term);
                    const nextIndex = Math.min(
                      allowedTerms.length - 1,
                      currentIndex + 1
                    );
                    const next = allowedTerms[nextIndex];
                    setTerm(next);
                    setTermInput(String(next));
                  }}
                  disabled={term >= maxTerm}
                >
                  <Add fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ inputMode: 'numeric' }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 4,
            mt: -1,
          }}
        >
          <Typography variant="body2">{minTerm}</Typography>
          <Typography variant="body2">Meses</Typography>
          <Typography variant="body2">{maxTerm}</Typography>
        </Box>

        <Button
          type="button"
          colorStyle="primary"
          sx={{ width: '100%' }}
          onClick={() => {
            window.parent.postMessage({ type: 'CREDIT_FLOW_CONTINUE' }, '*');
          }}
        >
          Continuar
        </Button>
      </Box>
    </Card>
  );
}
