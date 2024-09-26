'use client';

import * as React from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
// import { IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Link from 'next/link';
import * as actions from '@/actions';
import { useStores } from '@/context/StoresContext'; // Custom context for selected store

interface StockData {
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
}

interface StockListTableProps {
  stocks?: StockData[]; // Make this prop optional and ensure it's always an array.
}

export default function StockListTable({ stocks = [] }: StockListTableProps) {

  const { selectedStore } = useStores(); // Use store context for store_id

  const handleDelete = (id: number) => {
    actions.productDelete(id);
  };

  // const rows = stocks; // Ensure that `rows` is always an array (even if empty).
  // Filter stocks by the selected store
  const selectedStoreId = selectedStore?.store_code || ''; // Read only from context
  const filteredStocks = selectedStoreId
    ? stocks.filter((stock) => stock.store_id === selectedStoreId)
    : stocks;

  const rows = filteredStocks.map(stock => ({ ...stock, id: stock.id.toString() })); // Ensure that `id` is a string



  const columns: GridColDef[] = [
    {
      field: 'store_id',
      headerName: '매장코드',
      width: 120,
    },
    {
      field: 'transaction_date',
      headerName: '거래일자',
      width: 120,
    },
    {
      field: 'supply',
      headerName: '공급자',
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
      field: 'specification',
      headerName: '규격',
      width: 130,
    },
    {
      field: 'unit',
      headerName: '단위',
      width: 130,
    },
    {
      field: 'unit_price',
      headerName: '단가',
      width: 130,
    },
    {
      field: 'qty',
      headerName: '수량',
      width: 130,
    },
    {
      field: 'amount',
      headerName: '금액',
      width: 130,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 121,
      renderCell: (params: GridCellParams) => (
        <>
          <Link href={`/admin/product/${params.id}/edit`}>
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
        columns={columns}
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
