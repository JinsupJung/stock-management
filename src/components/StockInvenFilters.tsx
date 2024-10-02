'use client';
import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { Box, Button, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useStores } from '@/context/StoresContext';

const stores = [
  { store_code: '000003', store_name: '놀부유황오리진흙구이 잠실점' },
  { store_code: '000004', store_name: '놀부부대찌개&족발보쌈 난곡점' },
  { store_code: '000005', store_name: '놀부항아리갈비 마포광흥창점' },
  { store_code: '000006', store_name: '놀부항아리갈비 명일점' },
  { store_code: '000158', store_name: '놀부청담직영점' },
];




// 월말 재고 조사
export default function StockInvenFilters() {
  const router = useRouter();
  const { selectedStore, setSelectedStore } = useStores();
  const [loading, setLoading] = useState(false);

  // Use SelectChangeEvent from Material UI to fix the typing error
  const handleStoreSelect = (event: SelectChangeEvent<string>) => {
    const selectedStore = stores.find((store) => store.store_code === event.target.value);
    if (selectedStore) {
      setSelectedStore(selectedStore);
    }
  };

  // 매장 월마감 처리
  const handleMonthEndClose = async () => {
    if (!selectedStore) return;

    setLoading(true);

    try {
      const response = await fetch('/api/inven/close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store_id: selectedStore.store_code, // 선택한 매장 ID 전송
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('월마감이 성공적으로 처리되었습니다.');
      } else {
        alert('월마감 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error closing month-end:', error);
      alert('월마감 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        p: 5,
        md: { p: 8 },
        backgroundColor: '#fff',
        boxShadow: 2,
        borderRadius: '0.25rem',
        mb: 8,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          height: '2.5rem',
          width: '0.4rem',
          backgroundColor: 'hsla(185, 64%, 39%, 1.0)',
          borderTopRightRadius: '0.375rem',
          borderBottomRightRadius: '0.375rem',
          top: { xs: '22%', sm: '34%' },
          left: { xs: '0px', sm: '0px' },
        },
      }}
    >
      <Box>
        {/* <Typography variant="h8">직영 선택</Typography> */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel id="store-select-label">직영선택</InputLabel>
          <Select
            labelId="store-select-label"
            id="store-select"
            value={selectedStore?.store_code || ''}
            onChange={handleStoreSelect}
            label=""
          >
            {stores.map((store) => (
              <MenuItem key={store.store_code} value={store.store_code}>
                {store.store_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 4,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 0 }, width: { xs: '100%', sm: 'auto' } }}>
          직영 재고 실사
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/inven/stock/add')}
          disabled={!selectedStore} // Disable the button if no store is selected
          sx={{
            backgroundColor: 'hsla(185, 64%, 39%, 1.0)',
            color: 'white',
            width: { xs: '100%', sm: '14rem' },
            '&:hover': { backgroundColor: 'hsla(185, 64%, 29%, 1.0)' },
          }}
        >
          매장 재고조사 기록
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        직영 선택 후 재고실사 버튼을 눌러주세요

        <Button
          variant="contained"
          onClick={handleMonthEndClose}
          disabled={!selectedStore || loading} // Disable the button while loading
          sx={{
            backgroundColor: 'hsla(185, 64%, 39%, 1.0)',
            color: 'white',
            width: { xs: '100%', sm: '14rem' },
            '&:hover': { backgroundColor: 'hsla(185, 64%, 29%, 1.0)' },
          }}
        >
          {loading ? '처리 중...' : '월마감'}
        </Button>
      </Box>

    </Box>
  );
}
