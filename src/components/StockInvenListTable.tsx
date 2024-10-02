'use client';

import * as React from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import Link from 'next/link';
import { useStores } from '@/context/StoresContext'; // Custom context for selected store


interface InvenData {
  id: number;
  store_id: string;
  stock_code: string;
  stock_name: string;
  qty: number;
  transaction_date: string;
}

interface InvenListTableProps {
  invens?: InvenData[]; // Make this prop optional and ensure it's always an array.
}

export default function InvenListTable({ invens = [] }: InvenListTableProps) {

  const { selectedStore } = useStores(); // Use store context for store_id
  const selectedStoreId = selectedStore?.store_code || ''; // Read only from context
  const filteredStocks = selectedStoreId
    ? invens.filter((inven) => inven.store_id === selectedStoreId)
    : invens;

  const rows = filteredStocks.map(stock => ({ ...stock, id: stock.id.toString() })); // Ensure that `id` is a string

  const columns: GridColDef[] = [
    {
      field: 'store_id',
      headerName: '매장코드',
      width: 120,
    },
    {
      field: 'transaction_date',
      headerName: '실사일자',
      width: 120,
    },
    {
      field: 'stock_code',
      headerName: '품목코드',
      width: 120,
    },
    {
      field: 'stock_name',
      headerName: '품목명',
      width: 150,
    },
    {
      field: 'qty',
      headerName: '수량',
      width: 130,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 121,
      renderCell: (params: GridCellParams) => (
        <>
          <Link href={`/inven/stock/${params.id}/edit`}>
            <EditOutlinedIcon
              style={{
                fontSize: '1.4rem',
                color: 'rgb(112 112 113)',
                marginRight: '0.5rem',
              }}
            />
          </Link>

          {/* <Link href={`/admin/product/${params.id}/view`}>
            <RemoveRedEyeOutlinedIcon
              style={{ fontSize: '1.4rem', color: 'rgb(112 112 113)' }}
            />
          </Link> */}
        </>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        rows={rows}

        columns={columns.map((column, index) => ({
          ...column,
          width: index === 3 ? (column.width || 100) * 4 : column.width, // 2번째 열의 너비를 2배로 설정
          align: typeof column.field === 'string' ? 'center' : 'right', // 문자: 가운데 정렬, 숫자: 오른쪽 정렬
          headerAlign: typeof column.field === 'string' ? 'center' : 'right', // 헤더도 같은 방식으로 정렬
        }))}



        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        sx={{
          height: 400, // Ensure the height is passed as a number
          width: '100%',
          backgroundColor: '#fff',
          paddingLeft: '10px',
          paddingRight: '10px',
          boxShadow: 2,
          borderRadius: '0.25rem',
        }}
      // pageSizeOptions={[10, 20]}
      />
    </>
  );
}
