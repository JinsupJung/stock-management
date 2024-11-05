'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // For session user
import {
  Box,
  Button,
  InputLabel,
  TextField,
  FormControl,
  Typography,
  Autocomplete,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useStores } from '@/context/StoresContext'; // Custom context for selected store
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { stores, suppliers } from '@/constants/stores';

interface StockMoveFormProps {
  stock: {
    id: number;
    store_id: string;
    stock_code: string;
    stock_name: string;
    current_qty: number | '';
  };
}

interface StoreProduct {
  stock_code: string;
  stock_name: string;
  specification: string;
  unit: string;
  conversion_weight: number | '';
  tax_type: String;
  product_type: String;
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

export default function StockMoveForm({ stock }: StockMoveFormProps) {
  const { data: session } = useSession(); // Fetch session data
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [isManualAmount, setIsManualAmount] = useState(false); // Track manual amount input
  const [loading, setLoading] = useState(false);
  const { selectedStore, setSelectedStore } = useStores();

  // TbStoreStock 기록용
  const [formState, setFormState] = useState({
    id: stock.id,
    store_id: stock.store_id,
    supply: '',
    store_name: '',
    stock_code: stock.stock_code,
    stock_name: stock.stock_name,
    specification: '',
    unit: '',
    current_qty: stock.current_qty !== '' ? stock.current_qty.toString() : '',
    transaction_date: dayjs().format('YYYY-MM-DD'), // 초기값은 'YYYY-MM-DD' 형식의 문자열
    created_by: session?.user?.name || '', // Session name
  });

  const store_name = selectedStore?.store_name || ''; // Read only from context

  // 저장 버튼 클릭
  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData();
    formData.append('store_id', formState.store_id);
    formData.append('transaction_date', formState.transaction_date.toString());
    formData.append('supply', '');
    formData.append('stock_code', formState.stock_code);
    formData.append('stock_name', formState.stock_name);
    formData.append('specification', '');
    formData.append('unit', '');
    formData.append('qty', formState.current_qty);
    formData.append('unit_price', '');
    formData.append('amount', '');
    formData.append('from_store', stock.store_id);
    formData.append('created_by', formState.created_by);

    // Update record details
    formData.append('id', String(formState.id));
    formData.append('qty', formState.current_qty);
    formData.append('amount', '');

    try {
      const response = await fetch('/api/move', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Perform a client-side redirect using Next.js router
          window.location.href = '/move'; // Redirect after successful operation
        } else {
          console.error('Operation failed:', result.message);
        }
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  // Fetch 품목 마스터
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

  // 매장 선택 핸들러
  const handleStoreSelect = (event: SelectChangeEvent<string>) => {
    const selectedToStore = stores.find((store) => store.id === event.target.value);

    if (selectedToStore) {
      // 선택된 매장의 store_id와 store_name을 상태로 업데이트
      setFormState((prevState) => ({
        ...prevState,
        store_id: selectedToStore.id, // 이동할 매장의 ID 설정
        store_name: selectedToStore.name, // 선택한 매장의 이름 설정
      }));
    }
  };

  // Handle field changes
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Check if 'qty' or 'unit_price' is being updated to reset auto-calculation
    if (name === 'qty' || name === 'unit_price') {
      setIsManualAmount(false);
    }
  };

  // Handle manual changes to the amount
  const handleAmountChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setFormState((prevState) => ({
      ...prevState,
      amount: value,
    }));
    setIsManualAmount(true); // Mark amount as manually edited
  };

  const handleSupplySelect = (event: any, newValue: string | null) => {
    setFormState((prevState) => ({
      ...prevState,
      supply: newValue || '',
    }));
  };

  // 날짜 변경 핸들러 (Dayjs 객체를 받아 문자열로 변환)
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setFormState({
        ...formState,
        transaction_date: date.format('YYYY-MM-DD'), // 문자열로 저장
      });
    }
  };

  const handleQtyChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;

    const inputQty = parseFloat(value);
    const maxQty = parseFloat(stock.current_qty !== '' ? stock.current_qty.toString() : '0');

    if (!isNaN(inputQty) && inputQty > maxQty) {
      alert('현재고량 보다 클 수 없습니다.');
      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      current_qty: value,
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{ borderBottom: '1px dashed #c8cdd3', pb: 1, display: 'flex' }}>
          <Typography variant="h5" fontWeight="bold">
            재고 매장 이동
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
            {/* 매장 선택 드롭다운 */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 2, marginBottom: '0.8em' }}>
              <InputLabel id="store-select-label">이동할 매장 선택</InputLabel>
              <Select
                labelId="store-select-label"
                id="store-select"
                value={formState.store_id}
                onChange={handleStoreSelect}
                label="이동할 매장 선택"
              >
                {stores
                  .filter((store) => store.id !== selectedStore?.store_code) // 현재 매장을 제외한 다른 매장만 표시
                  .map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {/* Store ID (read-only) */}
            <TextField
              label="이동할 매장코드"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="store_id"
              name="store_id"
              value={formState.store_id}
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="현재 매장 코드"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="from_store"
              name="from_store"
              value={stock.store_id}
              InputProps={{ readOnly: true }}
            />
            <input type="hidden" name="from_store" value={stock.store_id} />

            {/* Transaction Date (Date Picker) */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DatePicker
                label="거래일"
                value={dayjs(formState.transaction_date)} // 문자열을 Dayjs 객체로 변환하여 DatePicker에 전달
                onChange={handleDateChange}
                slotProps={{
                  textField: { fullWidth: true, sx: { marginBottom: '2.4em' } },
                }}
              />
            </LocalizationProvider>

            {/* Hidden field for transaction_date */}
            <input type="hidden" name="transaction_date" value={formState.transaction_date} />

            <TextField
              label="품명"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="stock_name"
              name="stock_name"
              value={stock.stock_name}
              InputProps={{ readOnly: true }}
            />

            {/* Auto-populated fields */}
            <TextField
              label="품목코드"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="stock_code"
              name="stock_code"
              value={stock.stock_code}
              InputProps={{ readOnly: true }}
            />

            {/* Quantity */}
            <TextField
              type="number"
              label="수량"
              fullWidth
              inputProps={{ min: '0', step: 'any' }}
              required
              sx={{ marginBottom: '0.8em' }}
              id="current_qty"
              name="current_qty"
              value={formState.current_qty}
              onChange={handleQtyChange}
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
