'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import { useStores } from '@/context/StoresContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { suppliers } from '@/constants/stores';

interface StockData {
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
  created_by: string;
  trans_no: string;
  accu_qty: string;
}

interface StoreProduct {
  stock_code: string;
  stock_name: string;
  specification: string;
  unit: string;
}

export default function StockBuyForm() {
  const { data: session } = useSession();
  const { selectedStore } = useStores();
  const [fields, setFields] = React.useState<StockData>({
    store_id: selectedStore?.store_code || '',
    transaction_date: dayjs().format('YYYY-MM-DD'),
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
    created_by: session?.user?.name || '',
    trans_no: '',
    accu_qty: '',
  });

  const [isManualAmount, setIsManualAmount] = useState(false);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;

    setFields((prevFields) => ({
      ...prevFields,
      status: 'new',
      [name]: value,
    }));

    if (name === 'qty' || name === 'unit_price') {
      setIsManualAmount(false);
    }
  };

  const handleSupplySelect = (event: any, newValue: string | null) => {
    setFields((prevFields) => ({
      ...prevFields,
      supply: newValue || '',
    }));
  };

  const handleStockSelect = (event: any, newValue: StoreProduct | null) => {
    if (newValue) {
      setFields((prevFields) => ({
        ...prevFields,
        stock_code: newValue.stock_code || '',
        stock_name: newValue.stock_name || 'Unnamed Product',
        specification: newValue.specification || '',
        unit: newValue.unit || '',
      }));
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setFields((prevFields) => ({
      ...prevFields,
      status: 'new',
      transaction_date: date ? date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    }));
  };

  useEffect(() => {
    if (fields.qty && fields.unit_price && !isManualAmount) {
      const qty = parseFloat(fields.qty);
      const unitPrice = parseFloat(fields.unit_price);

      if (!isNaN(qty) && !isNaN(unitPrice)) {
        const calculatedAmount = (qty * unitPrice).toFixed(2);
        setFields((prevFields) => ({
          ...prevFields,
          amount: calculatedAmount,
        }));
      }
    }
  }, [fields.qty, fields.unit_price, isManualAmount]);

  const handleAmountChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setFields((prevFields) => ({
      ...prevFields,
      amount: value,
      status: 'new',
    }));
    setIsManualAmount(true);
  };

  const handleTaxYnChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFields((prevFields) => ({
      ...prevFields,
      tax_yn: event.target.value as string,
    }));
  };

  return (
    <>
      <form action="/api/buy" method="POST" encType="multipart/form-data">
        <Box sx={{ borderBottom: '1px dashed #c8cdd3', pb: 1, display: 'flex' }}>
          <Typography variant="h5" fontWeight="bold">
            직영 사입 기록
          </Typography>
        </Box>

        <Box sx={{ my: 5, display: 'flex', flexWrap: 'wrap' }}>
          <Box
            sx={{
              p: 5,
              bgcolor: 'background.paper',
              boxShadow: 2,
              borderRadius: '0.25rem',
              width: { xs: '100%', sm: '100%', md: '66.667%' },
            }}
          >
            {/* 매장코드 (읽기 전용) */}
            <TextField
              label="매장코드"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="store_id"
              name="store_id"
              value={fields.store_id}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="매장명"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="store_name"
              name="store_name"
              value={selectedStore?.store_name || ''}
              InputProps={{ readOnly: true }}
            />

            {/* 거래일 (Date Picker) */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DatePicker
                label="거래일"
                value={fields.transaction_date ? dayjs(fields.transaction_date) : null}
                onChange={handleDateChange}
                slotProps={{
                  textField: { fullWidth: true, sx: { marginBottom: '2.4em' } },
                }}
              />
            </LocalizationProvider>

            {/* 숨겨진 입력: transaction_date */}
            <input type="hidden" name="transaction_date" value={fields.transaction_date} />

            {/* 공급자 선택 (Autocomplete) */}
            <Autocomplete
              options={suppliers}
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
            {/* 숨겨진 입력: 공급자 */}
            <input type="hidden" name="supply" value={fields.supply} />

            {/* 상품 선택 (Autocomplete) */}
            <Autocomplete
              options={storeProducts}
              getOptionLabel={(option) => option.stock_name || ''}
              onChange={handleStockSelect}
              renderInput={(params) => (
                <TextField {...params} label="품명" fullWidth required sx={{ marginBottom: '0.8em' }} />
              )}
            />

            {/* 숨겨진 입력: stock_code, stock_name, status */}
            <input type="hidden" name="stock_code" value={fields.stock_code} />
            <input type="hidden" name="stock_name" value={fields.stock_name} />
            <input type="hidden" name="status" value={fields.status} />

            {/* 자동 입력 필드 */}
            <TextField
              label="품목코드"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="stock_code_display"
              name="stock_code_display"
              value={fields.stock_code}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="규격"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="specification"
              name="specification"
              value={fields.specification}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="단위"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="unit"
              name="unit"
              value={fields.unit}
              InputProps={{ readOnly: true }}
            />

            {/* 과세 여부 선택 */}
            <FormControl fullWidth sx={{ marginBottom: '0.8em' }}>
              <InputLabel id="tax_yn-label">과세 여부</InputLabel>
              <Select
                labelId="tax_yn-label"
                id="tax_yn"
                name="tax_yn"
                value={fields.tax_yn}
                label="과세 여부"
                onChange={handleTaxYnChange}
              >
                <MenuItem value="과세">과세</MenuItem>
                <MenuItem value="면세">면세</MenuItem>
              </Select>
            </FormControl>

            {/* 수량 */}
            <TextField
              type="number"
              label="수량"
              fullWidth
              inputProps={{ min: '0', step: 'any' }}
              required
              sx={{ marginBottom: '0.8em' }}
              id="qty"
              name="qty"
              value={fields.qty}
              onChange={handleChange}
            />

            {/* 단가 */}
            <TextField
              type="number"
              label="단가"
              fullWidth
              inputProps={{ min: '0', step: 'any' }}
              required
              sx={{ marginBottom: '0.8em' }}
              id="unit_price"
              name="unit_price"
              value={fields.unit_price}
              onChange={handleChange}
            />

            {/* 금액 */}
            <TextField
              type="number"
              label="금액"
              fullWidth
              inputProps={{ min: '0', step: 'any' }}
              required
              sx={{ marginBottom: '0.8em' }}
              id="amount"
              name="amount"
              value={fields.amount}
              onChange={handleAmountChange}
            />

            {/* 기록자 */}
            <TextField
              label="기록자"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
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
