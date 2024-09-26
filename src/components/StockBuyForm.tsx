'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // For session user
import { Box, Button, TextField, Typography, Autocomplete, FormControl, MenuItem, Select, InputLabel, SelectChangeEvent } from '@mui/material';
import { useStores } from '@/context/StoresContext'; // Custom context for selected store
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Date picker component from MUI
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

interface StockData {
  store_id: string;
  transaction_date: string | Date;
  supply: string;
  stock_code: string;
  stock_name: string;
  tax_yn: string;
  specification: string;
  unit: string;
  qty: number | '';
  unit_price: number | '';
  amount: number | '';
  status: string;
  created_by: string;
}

interface StoreProduct {
  stock_code: string;
  stock_name: string;
  specification: string;
  unit: string;
}

// Predefined supplier list (Dropdown options)
const suppliers = [
  "본사", "웰스토리", "본사소모품", "웰스토리소모품", "봄맛푸드소모품",
  "우리와인", "고성주류", "서린주류", "퐁당수산", "제주더플러스", "봄맛푸드",
  "누리미트", "기대상사", "미트맨", "강남유통", "삼성", "외부사입", "원천주류",
  "의창실업", "금성", "원하나", "복주", "파낙스", "마루", "대농마트"
];

export default function StockBuyForm() {
  const { data: session } = useSession(); // Fetch session data
  const { selectedStore } = useStores(); // Use store context for store_id
  const [fields, setFields] = React.useState<StockData>({
    store_id: selectedStore?.store_code || '', // Read only from context
    transaction_date: new Date(), // Default to today
    supply: '',
    stock_code: '',
    stock_name: '',
    tax_yn: '',
    specification: '',
    unit: '',
    qty: '',
    unit_price: '',
    amount: '',
    status: '',
    created_by: session?.user?.name || '', // Session name
  });

  const [isManualAmount, setIsManualAmount] = useState(false); // Track manual amount input
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchStoreProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/buy/master`);
        setStoreProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch store products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreProducts();
  }, []);

  // Handle field changes
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    const parsedValue = value === '' ? '' : parseFloat(value);

    setFields((prevFields) => ({
      ...prevFields,
      [name]: name === 'qty' || name === 'unit_price' ? parsedValue : value,
    }));

    if (name === 'qty' || name === 'unit_price') {
      setIsManualAmount(false); // Reset to auto-calculate amount if qty or unit_price is modified
    }
  };

  const handleSupplySelect = (event: any, newValue: string | null) => {
    setFields({
      ...fields,
      supply: newValue || '',
    });
  };

  const handleStockSelect = (event: any, newValue: StoreProduct | null) => {
    if (newValue) {
      setFields({
        ...fields,
        stock_code: newValue.stock_code || '',
        stock_name: newValue.stock_name || 'Unnamed Product',
        specification: newValue.specification || '',
        unit: newValue.unit || '',
      });
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFields({
      ...fields,
      transaction_date: date?.format('YYYY-MM-DD') || '',
    });
  };

  // Auto-calculate amount unless it's manually edited
  useEffect(() => {
    if (fields.qty && fields.unit_price && !isManualAmount) {
      const calculatedAmount = parseFloat(fields.qty.toString()) * parseFloat(fields.unit_price.toString());
      setFields((prevFields) => ({
        ...prevFields,
        amount: calculatedAmount || '',
      }));
    }
  }, [fields.qty, fields.unit_price, isManualAmount]);

  // Handle manual amount change
  const handleAmountChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value === '' ? '' : parseFloat(evt.target.value); // Convert to number or keep as empty string
    setFields((prevFields) => ({
      ...prevFields,
      amount: value,
    }));
    setIsManualAmount(true); // Mark amount as manually edited
  };


  return (
    <>
      <form action="/api/buy/stock" method="POST" encType="multipart/form-data">
        <Box sx={{ borderBottom: '1px dashed #c8cdd3', pb: 1, display: 'flex' }}>
          <Typography variant="h5" fontWeight="bold">직영 사입 기록</Typography>
        </Box>

        <Box sx={{ my: 5, display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{
            p: 5,
            bgcolor: 'background.paper',
            boxShadow: 2,
            borderRadius: '0.25rem',
            width: { xs: '100%', sm: '100%', md: '66.667%' },
          }}>
            {/* Store ID (read-only) */}
            <TextField
              label="매장코드"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="store_id"
              name="store_id"
              value={fields.store_id}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="매장명"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="store_name"
              name="store_name"
              value={selectedStore?.store_name || ''}
              InputProps={{ readOnly: true }}
            />

            {/* Transaction Date (Date Picker) */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DatePicker
                label="거래일"
                value={dayjs(fields.transaction_date)}
                onChange={handleDateChange}
                slotProps={{
                  textField: { fullWidth: true, sx: { marginBottom: '2.4em' } }
                }}
              />
            </LocalizationProvider>

            {/* Hidden field for transaction_date */}
            <input
              type="hidden"
              name="transaction_date"
              value={typeof fields.transaction_date === 'string'
                ? fields.transaction_date
                : fields.transaction_date.toISOString().split('T')[0]} // Convert Date to YYYY-MM-DD string format 
            />

            {/* Supply Autocomplete */}
            <Autocomplete
              options={suppliers}
              onChange={(event, newValue) => handleSupplySelect(event, newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="공급자"
                  fullWidth
                  required
                  sx={{ marginBottom: '1.2em' }}
                />
              )}
            />
            {/* Hidden input to ensure the value is submitted */}
            <input type="hidden" name="supply" value={fields.supply} />

            {/* Product Autocomplete */}
            <Autocomplete
              options={storeProducts}
              getOptionLabel={(option) => option.stock_name || ''}
              onChange={(event, newValue) => handleStockSelect(event, newValue)}
              renderInput={(params) => (
                <TextField {...params} label="품명" fullWidth required sx={{ marginBottom: '1.2em' }} />
              )}
            />

            {/* Hidden input to ensure the value is submitted */}
            <input type="hidden" name="stock_code" value={fields.stock_code} />
            <input type="hidden" name="stock_name" value={fields.stock_name} />

            {/* Auto-populated fields */}
            <TextField
              label="품목코드"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="stock_code"
              name="stock_code"
              value={fields.stock_code}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="규격"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="specification"
              name="specification"
              value={fields.specification}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="단위"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="unit"
              name="unit"
              value={fields.unit}
              InputProps={{ readOnly: true }}
            />

            {/* Quantity */}
            <TextField
              type="number"
              label="수량"
              fullWidth
              inputProps={{ min: '0' }}
              required
              sx={{ marginBottom: '1.4em' }}
              id="qty"
              name="qty"
              value={fields.qty}
              onChange={handleChange}
            />

            {/* Unit Price */}
            <TextField
              type="number"
              label="단가"
              fullWidth
              inputProps={{ min: '0' }}
              required
              sx={{ marginBottom: '1.4em' }}
              id="unit_price"
              name="unit_price"
              value={fields.unit_price}
              onChange={handleChange}
            />

            {/* Amount */}
            <TextField
              label="금액"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="amount"
              name="amount"
              value={fields.amount}
              onChange={handleAmountChange} // Allow manual change of amount
            />

            {/* Created By */}
            <TextField
              label="기록자"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="created_by"
              name="created_by"
              value={fields.created_by}
              InputProps={{ readOnly: true }}
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: 'end' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              height: '48px',
              backgroundColor: 'hsla(185, 64%, 39%, 1.0)',
              '&:hover': { backgroundColor: 'hsla(185, 64%, 29%, 1.0)' },
            }}
          >
            저장
          </Button>
        </Box>
      </form>
    </>
  );
}
