'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // For session user
import { useStores } from '@/context/StoresContext'; // Custom context for selected store
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete
} from '@mui/material';

import * as actions from '@/actions';

interface StockMoveFormProps {
  stock: {
    id: number;
    store_id: string;
    transaction_date: string;
    supply: string;
    stock_code: string;
    stock_name: string;
    tax_yn: string;
    specification: string;
    unit: string;
    qty: string;
    unit_price: string;
    amount: string;
    status: string;
    from_store: string;
    created_by: string;
  };
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

export default function StockMoveForm({ stock }: StockMoveFormProps) {
  const { data: session } = useSession(); // Fetch session data
  const { selectedStore } = useStores(); // Use store context for store_id
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isManualAmount, setIsManualAmount] = useState(false); // Track manual amount input

  // Use a single state object to manage the stock details
  const [formState, setFormState] = useState({
    store_id: stock.store_id,
    transaction_date: stock.transaction_date,
    supply: stock.supply,
    stock_code: stock.stock_code,
    stock_name: stock.stock_name,
    specification: stock.specification,
    unit: stock.unit,
    qty: stock.qty,
    unit_price: stock.unit_price,
    amount: stock.amount,
    status: stock.status,
    from_store: stock.from_store,
    created_by: session?.user?.name || stock.created_by,
  });

  const store_name = selectedStore?.store_name || ''; // Read only from context

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

  const handleStockSelect = (event: any, newValue: StoreProduct | null) => {
    if (newValue) {
      setFormState((prevState) => ({
        ...prevState,
        stock_code: newValue.stock_code,
        stock_name: newValue.stock_name,
        specification: newValue.specification,
        unit: newValue.unit,
      }));
    }
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    actions.stockMove(formData);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormState((prevState) => ({
      ...prevState,
      transaction_date: date?.format('YYYY-MM-DD') || '',
    }));
  };

  const handleSupplySelect = (event: any, newValue: string | null) => {
    setFormState((prevState) => ({
      ...prevState,
      supply: newValue || '',
    }));
  };

  // Handle field changes
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: name === 'qty' || name === 'unit_price' ? Number(value) : value,
    }));

    // Check if 'qty' or 'unit_price' is being updated to reset auto-calculation
    if (name === 'qty' || name === 'unit_price') {
      setIsManualAmount(false);
    }
  };

  const handleAmountChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      amount: evt.target.value,
    }));
    setIsManualAmount(true); // Mark amount as manually edited
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{ borderBottom: '1px dashed #c8cdd3', pb: 1, display: 'flex' }}>
          <Typography variant="h5" fontWeight="bold">매장 재고 이동</Typography>
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
              value={stock.store_id}
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
                value={dayjs(stock.transaction_date)}
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
              value={
                !isNaN(Date.parse(stock.transaction_date))
                  ? new Date(stock.transaction_date).toISOString().split('T')[0] // Convert string to Date and format
                  : stock.transaction_date // Use the original string if it's not a valid date
              }
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
            <input type="hidden" name="supply" value={stock.supply} />

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
            <input type="hidden" name="stock_code" value={stock.stock_code} />
            <input type="hidden" name="stock_name" value={stock.stock_name} />

            {/* Auto-populated fields */}
            <TextField
              label="품목코드"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="stock_code"
              name="stock_code"
              value={stock.stock_code}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="규격"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="specification"
              name="specification"
              value={stock.specification}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="단위"
              fullWidth
              required
              sx={{ marginBottom: '1.2em' }}
              id="unit"
              name="unit"
              value={stock.unit}
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
              value={stock.qty}
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
              value={stock.unit_price}
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
              value={stock.amount}
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
              value={stock.created_by}
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
