'use client';

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

export default function StockFilters() {
  const router = useRouter();
  const { selectedStore, setSelectedStore } = useStores();

  // Use SelectChangeEvent from Material UI to fix the typing error
  const handleStoreSelect = (event: SelectChangeEvent<string>) => {
    const selectedStore = stores.find((store) => store.store_code === event.target.value);
    if (selectedStore) {
      setSelectedStore(selectedStore);
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

        {/* {selectedStore && ( */}
        {/* <Box sx={{ mt: 3 }}> */}
        {/* <Typography variant="subtitle1">Selected Store:</Typography> */}
        {/* <Typography>Store Code: {selectedStore.store_code}</Typography> */}
        {/* <Typography>{selectedStore.store_name}</Typography> */}
        {/* </Box> */}
        {/* )} */}
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
          직영 사입 관리 - 직영 선택 후 사입 등록 버튼을 눌러주세요
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/buy/stock/add')}
          disabled={!selectedStore} // Disable the button if no store is selected
          sx={{
            backgroundColor: 'hsla(185, 64%, 39%, 1.0)',
            color: 'white',
            width: { xs: '100%', sm: '14rem' },
            '&:hover': { backgroundColor: 'hsla(185, 64%, 29%, 1.0)' },
          }}
        >
          사입 등록
        </Button>
      </Box>
    </Box>
  );
}
