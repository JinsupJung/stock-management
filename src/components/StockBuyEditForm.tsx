'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useStores } from '@/context/StoresContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { suppliers } from '@/constants/stores';

interface StockEditFormProps {
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
    qty: number | '';
    unit_price: number | '';
    amount: number | '';
    status: string;
    from_store: string;
    created_by: string;
    accu_qty: number | '';
  };
}

interface StoreProduct {
  stock_code: string;
  stock_name: string;
  specification: string;
  unit: string;
}

export default function StockBuyEditForm({ stock }: StockEditFormProps) {
  const { data: session } = useSession();
  const { selectedStore } = useStores();
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [isManualAmount, setIsManualAmount] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form state with stock data
  const [formState, setFormState] = useState({
    id: stock.id,
    store_id: stock.store_id,
    transaction_date: stock.transaction_date,
    supply: stock.supply,
    stock_code: stock.stock_code,
    stock_name: stock.stock_name,
    specification: stock.specification,
    unit: stock.unit,
    qty: stock.qty.toString(),
    unit_price: stock.unit_price.toString(),
    amount: stock.amount.toString(),
    status: 'update',
    from_store: stock.from_store,
    created_by: session?.user?.name || stock.created_by,
    accu_qty: stock.qty.toString(),
    tax_yn: stock.tax_yn,
  });

  const store_name = selectedStore?.store_name || '';

  // Fetch products
  useEffect(() => {
    const fetchStoreProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/master`);
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

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;

    setFormState((prevState) => ({
      ...prevState,
      status: 'update',
      [name]: value,
    }));

    if (name === 'qty' || name === 'unit_price') {
      setIsManualAmount(false);
    }
  };

  // 추가된 함수: tax_yn 변경 처리
  const handleTaxYnChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormState((prevState) => ({
      ...prevState,
      tax_yn: event.target.value as string,
    }));
  };

  useEffect(() => {
    if (formState.qty && formState.unit_price && !isManualAmount) {
      const qty = parseFloat(formState.qty);
      const unitPrice = parseFloat(formState.unit_price);

      if (!isNaN(qty) && !isNaN(unitPrice)) {
        const calculatedAmount = (qty * unitPrice).toFixed(2);
        setFormState((prevFields) => ({
          ...prevFields,
          amount: calculatedAmount,
        }));
      }
    }
  }, [formState.qty, formState.unit_price, isManualAmount]);

  const handleAmountChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setFormState((prevState) => ({
      ...prevState,
      amount: value,
      status: 'update',
    }));
    setIsManualAmount(true);
  };

  const handleSupplySelect = (event: any, newValue: string | null) => {
    setFormState((prevState) => ({
      ...prevState,
      supply: newValue || '',
    }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setFormState((prevState) => ({
      ...prevState,
      status: 'update',
      transaction_date: date ? date.format('YYYY-MM-DD') : '',
    }));
  };

  return (
    <>
      <form action="/api/buy" method="POST" encType="multipart/form-data">
        <Box sx={{ borderBottom: '1px dashed #c8cdd3', pb: 1, display: 'flex' }}>
          <Typography variant="h5" fontWeight="bold">자재 내용 수정</Typography>
        </Box>

        <Box sx={{ my: 5, display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{
            p: 5,
            bgcolor: 'background.paper',
            boxShadow: 2,
            borderRadius: '0.25rem',
            width: { xs: '100%', sm: '100%', md: '66.667%' },
          }}>
            <input type="hidden" name="id" value={formState.id} />

            {/* Store ID (read-only) */}
            <TextField
              label="매장코드"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="store_id"
              name="store_id"
              value={formState.store_id}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="매장명"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="store_name"
              name="store_name"
              value={store_name}
              InputProps={{ readOnly: true }}
            />

            {/* Transaction Date (Date Picker) */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DatePicker
                label="거래일"
                value={formState.transaction_date ? dayjs(formState.transaction_date) : null}
                onChange={handleDateChange}
                slotProps={{
                  textField: { fullWidth: true, sx: { marginBottom: '2.4em' } }
                }}
              />
            </LocalizationProvider>

            {/* Hidden field for transaction_date */}
            <input type="hidden" name="transaction_date" value={formState.transaction_date} />

            {/* Supply Autocomplete */}
            <Autocomplete
              options={suppliers}
              value={formState.supply || null}
              onChange={handleSupplySelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="공급자"
                  fullWidth
                  required
                  sx={{ marginBottom: '0.8em' }}
                />
              )}
            />
            {/* Hidden input to ensure the value is submitted */}
            <input type="hidden" name="supply" value={formState.supply} />

            {/* Product Autocomplete */}
            <Autocomplete
              options={storeProducts}
              value={storeProducts.find(product => product.stock_code === formState.stock_code) || null}
              getOptionLabel={(option) => option.stock_name || ''}
              onChange={handleStockSelect}
              renderInput={(params) => (
                <TextField {...params} label="품명" fullWidth required sx={{ marginBottom: '0.8em' }} />
              )}
            />

            {/* Hidden inputs */}
            <input type="hidden" name="stock_code" value={formState.stock_code} />
            <input type="hidden" name="stock_name" value={formState.stock_name} />
            <input type="hidden" name="status" value="update" />
            <input type="hidden" name="accu_qty" value={formState.accu_qty} />

            {/* Auto-populated fields */}
            <TextField
              label="품목코드"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="stock_code_display"
              name="stock_code_display"
              value={formState.stock_code}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="규격"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="specification"
              name="specification"
              value={formState.specification}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="단위"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="unit"
              name="unit"
              value={formState.unit}
              InputProps={{ readOnly: true }}
            />

            {/* 추가된 과세 여부 선택 필드 */}
            <FormControl fullWidth sx={{ marginBottom: '0.8em' }}>
              <InputLabel id="tax_yn-label">과세 여부</InputLabel>
              <Select
                labelId="tax_yn-label"
                id="tax_yn"
                name="tax_yn"
                value={formState.tax_yn}
                label="과세 여부"
                onChange={handleTaxYnChange}
              >
                <MenuItem value="과세">과세</MenuItem>
                <MenuItem value="면세">면세</MenuItem>
              </Select>
            </FormControl>
            {/* Hidden input for tax_yn */}
            <input type="hidden" name="tax_yn" value={formState.tax_yn} />

            {/* Quantity */}
            <TextField
              type="number"
              label="수량"
              fullWidth
              inputProps={{ min: '0', step: 'any' }}
              required
              sx={{ marginBottom: '0.8em' }}
              id="qty"
              name="qty"
              value={formState.qty}
              onChange={handleChange}
            />

            {/* Unit Price */}
            <TextField
              type="number"
              label="단가"
              fullWidth
              inputProps={{ min: '0', step: 'any' }}
              required
              sx={{ marginBottom: '0.8em' }}
              id="unit_price"
              name="unit_price"
              value={formState.unit_price}
              onChange={handleChange}
            />

            {/* Amount */}
            <TextField
              type="number"
              label="금액"
              fullWidth
              inputProps={{ min: '0', step: 'any' }}
              required
              sx={{ marginBottom: '0.8em' }}
              id="amount"
              name="amount"
              value={formState.amount}
              onChange={handleAmountChange}
            />

            {/* Created By */}
            <TextField
              label="기록자"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="created_by"
              name="created_by"
              value={formState.created_by}
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
