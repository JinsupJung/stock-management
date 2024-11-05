'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';
import { useSession } from 'next-auth/react'; // For session user
import { useStores } from '@/context/StoresContext'; // Custom context for selected store
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface StockEditFormProps {
  stock: {
    id: number;
    store_id: string;
    transaction_date: string;
    stock_code: string;
    stock_name: string;
    qty: number | '';
    created_by: string;
  };
}

interface StoreProduct {
  stock_code: string;
  stock_name: string;
  specification: string;
  unit: string;
}

export default function StockEditForm({ stock }: StockEditFormProps) {
  const { data: session } = useSession(); // 세션 데이터 가져오기
  const { selectedStore } = useStores(); // 매장 정보 가져오기
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // 상태 초기화
  const [formState, setFormState] = useState({
    id: stock.id,
    store_id: stock.store_id,
    transaction_date: stock.transaction_date,
    stock_code: stock.stock_code,
    stock_name: stock.stock_name,
    qty: stock.qty,
    created_by: session?.user?.name || stock.created_by,
  });

  const store_name = selectedStore?.store_name || ''; // 읽기 전용 매장명

  // Decimal 필드를 숫자로 변환하는 유틸리티 함수
  const convertDecimalFields = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(convertDecimalFields);
    } else if (data && typeof data === 'object') {
      const newObj: any = {};
      for (const key in data) {
        if (data[key] && data[key]._isDecimal) {
          newObj[key] = parseFloat(data[key].toString());
        } else {
          newObj[key] = convertDecimalFields(data[key]);
        }
      }
      return newObj;
    }
    return data;
  };

  // 품목 마스터 데이터 가져오기
  useEffect(() => {
    const fetchStoreProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/master`);
        const convertedData = convertDecimalFields(response.data);
        setStoreProducts(convertedData);
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
      }));
    }
  };

  // 필드 변경 처리
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    const parsedValue = value === '' ? '' : parseFloat(value);

    setFormState((prevState) => ({
      ...prevState,
      [name]: name === 'qty' ? parsedValue : value,
    }));
  };

  // 날짜 변경 처리
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setFormState((prevState) => ({
      ...prevState,
      transaction_date: date ? date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    }));
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 방지

    const formDataToSend = {
      id: formState.id,
      store_id: formState.store_id,
      transaction_date: formState.transaction_date,
      stock_code: formState.stock_code,
      stock_name: formState.stock_name,
      qty: formState.qty.toString(),
      created_by: formState.created_by,
    };

    try {
      const response = await fetch('/api/inven', {
        method: 'PUT', // 업데이트 요청이므로 PUT 메서드 사용
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend), // JSON 형식으로 데이터 전송
      });

      if (response.ok) {
        alert('재고 실사 기록이 성공적으로 수정되었습니다.');
        window.location.href = '/inven'; // 수정 후 페이지 이동
      } else {
        alert('재고 실사 수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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

            {/* 숨겨진 필드: id */}
            <input type="hidden" name="id" value={formState.id} />

            {/* 매장코드 (읽기 전용) */}
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

            {/* 거래일 (Date Picker) */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DatePicker
                label="거래일"
                value={dayjs(formState.transaction_date)}
                onChange={handleDateChange}
                slotProps={{
                  textField: { fullWidth: true, sx: { marginBottom: '2.4em' } }
                }}
              />
            </LocalizationProvider>

            {/* 품명 선택 (Autocomplete) */}
            <Autocomplete
              options={storeProducts}
              value={storeProducts.find(product => product.stock_code === formState.stock_code) || null}
              getOptionLabel={(option) => option.stock_name || ''}
              onChange={handleStockSelect}
              renderInput={(params) => (
                <TextField {...params} label="품명" fullWidth required sx={{ marginBottom: '0.8em' }} />
              )}
            />

            {/* 숨겨진 입력: stock_code, stock_name */}
            <input type="hidden" name="stock_code" value={formState.stock_code} />
            <input type="hidden" name="stock_name" value={formState.stock_name} />

            {/* 품목코드 (자동 입력) */}
            <TextField
              label="품목코드"
              fullWidth
              required
              sx={{ marginBottom: '0.8em' }}
              id="stock_code"
              name="stock_code"
              value={formState.stock_code}
              InputProps={{ readOnly: true }}
            />

            {/* 수량 입력 */}
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

            {/* 기록자 */}
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
