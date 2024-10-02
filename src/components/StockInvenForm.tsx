'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box, Button, TextField, Typography, Autocomplete, FormControl, MenuItem, Select, InputLabel, SelectChangeEvent,
} from '@mui/material';
import { useStores } from '@/context/StoresContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { stores, suppliers } from '@/constants/stores';

interface InvenData {
  store_id: string;
  transaction_date: string | Date;
  stock_code: string;
  stock_name: string;
  qty: number | '';
  created_by: string;
}

interface StoreProduct {
  stock_code: string;
  stock_name: string;
  specification: string;
  unit: string;
  conversion_weight: number | '';
  tax_type: string;
  product_type: string;
  purchase_cost: number | '';
  supply_price_type: string;
  branch_price: number | '';
  franchise_price: number | '';
  other_price: number | '';
  storage_type: string;
  expiration_period: string;
  related_department: string;
  management_product: string;
  logo_product: string;
  livestock_product: string;
  optimal_stock_qty: number | '';
  ars: string;
  is_active: string;
  supplier: string;
}

export default function StockInvenForm() {
  const { data: session } = useSession(); // Fetch session data
  const { selectedStore } = useStores(); // Use store context for store_id
  const [formData, setformData] = React.useState<InvenData>({
    store_id: selectedStore?.store_code || '', // Read only from context
    transaction_date: new Date(), // Default to today
    stock_code: '',
    stock_name: '',
    qty: '',
    created_by: session?.user?.name || '', // Session name
  });

  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Handle field changes
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    const parsedValue = value === '' ? '' : parseFloat(value);

    setformData((prevformData) => ({
      ...prevformData,
      [name]: name === 'qty' ? parsedValue : value,
    }));
  };

  const handleStockSelect = (event: any, newValue: StoreProduct | null) => {
    if (newValue) {
      setformData({
        ...formData,
        stock_code: newValue.stock_code || '',
        stock_name: newValue.stock_name || 'Unnamed Product',
      });
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setformData({
      ...formData,
      transaction_date: date?.format('YYYY-MM-DD') || '',
    });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    const formDataToSend = {
      store_id: formData.store_id,
      transaction_date: formData.transaction_date.toString(),
      stock_code: formData.stock_code,
      stock_name: formData.stock_name,
      qty: formData.qty.toString(),
      created_by: formData.created_by,
    };

    try {
      const response = await fetch('/api/inven', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend), // JSON 형식으로 데이터 전송
      });

      if (response.ok) {
        alert('재고 실사 기록이 성공적으로 저장되었습니다.');
      } else if (response.status === 400) {
        alert('동일한 매장 및 품목이 이미 존재합니다. 다시 입력해 주세요.');
      } else {
        alert('재고 실사 저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{ borderBottom: '1px dashed #c8cdd3', pb: 1, display: 'flex' }}>
          <Typography variant="h5" fontWeight="bold">직영 재고 실사 기록</Typography>
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
              sx={{ marginBottom: '0.8em' }}
              id="store_id"
              name="store_id"
              value={formData.store_id}
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

            {/* Transaction Date (Date Picker) */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DatePicker
                label="거래일"
                value={dayjs(formData.transaction_date)}
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
              value={typeof formData.transaction_date === 'string'
                ? formData.transaction_date
                : formData.transaction_date.toISOString().split('T')[0]} // Convert Date to YYYY-MM-DD string format 
            />

            {/* Product Autocomplete */}
            <Autocomplete
              options={storeProducts}
              getOptionLabel={(option) => option.stock_name || ''}
              onChange={(event, newValue) => handleStockSelect(event, newValue)}
              renderInput={(params) => (
                <TextField {...params} label="품명" fullWidth required sx={{ marginBottom: '0.8em' }} />
              )}
            />

            {/* Hidden input to ensure the value is submitted */}
            <input type="hidden" name="stock_code" value={formData.stock_code} />
            <input type="hidden" name="stock_name" value={formData.stock_name} />

            {/* Auto-populated formData */}
            <TextField
              label="품목코드"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="stock_code"
              name="stock_code"
              value={formData.stock_code}
              InputProps={{ readOnly: true }}
            />

            {/* Quantity */}
            <TextField
              type="number"
              label="수량"
              fullWidth
              inputProps={{ min: '0' }}
              required
              sx={{ marginBottom: '0.8em' }}
              id="qty"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
            />

            {/* Created By */}
            <TextField
              label="기록자"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="created_by"
              name="created_by"
              value={formData.created_by}
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
