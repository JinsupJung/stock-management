'use client';

import * as React from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
// import { IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Link from 'next/link';
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
  qty: number;
  unit_price: number;
  amount: number;
  status: string;
  from_store: string;
  trans_no: number;
  accu_qty: number;
}

interface StockListTableProps {
  stocks?: StockData[]; // Make this prop optional and ensure it's always an array.
}

export default function StockListTable({ stocks = [] }: StockListTableProps) {

  const { selectedStore } = useStores(); // Use store context for store_id


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
      field: 'accu_qty',
      headerName: '누적수량',
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
          <Link href={`/buy/stock/${params.id}/edit`}>
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
        columns={columns.map((column) => ({
          ...column,
          align: typeof column.field === 'string' ? 'center' : 'right', // 문자: 가운데 정렬, 숫자: 오른쪽 정렬
          headerAlign: typeof column.field === 'string' ? 'center' : 'right', // 헤더도 같은 방식으로 정렬
        }))}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        sx={{
          height: 720, // DataGrid의 높이 설정
          width: '100%',
          backgroundColor: '#fff',
          paddingLeft: '10px',
          paddingRight: '10px',
          boxShadow: 2,
          borderRadius: '0.25rem',
          border: '1px solid #ccc',  // 외곽 박스선 추가
          '& .MuiDataGrid-cell': {
            borderRight: '1px solid rgba(224, 224, 224, 1)', // 세로선 스타일 지정 (열 구분)
            padding: '0 8px',  // 셀의 padding 설정
          },
          '& .MuiDataGrid-columnHeader': {
            borderRight: '1px solid rgba(224, 224, 224, 1)',  // 헤더에 세로선 추가
          },
        }}
        rowHeight={30}  // Row의 기본 높이 조정
        // headerHeight={40}  // 헤더의 기본 높이 설정
        pageSizeOptions={[10, 20]}
      />


    </>
  );
}
