'use client';

import * as React from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Link from 'next/link';
import { formatToUSD } from '@/utils/moneyFormat';
import * as actions from '@/actions';

interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  status: string;
}

interface ProductListTableProps {
  products: ProductData[];
}

export default function ProductListTable({ products }: ProductListTableProps) {
  const handleDelete = (id: number) => {
    actions.productDelete(id);
  };

  const rows = products;

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: '',
      width: 120,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      renderCell: (params: GridCellParams) => {
        const paramVal = params.formattedValue as number;
        const formattedPrice = formatToUSD(paramVal);
        return <>{formattedPrice}</>;
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
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

          <Link href={`/admin/product/${params.id}/view`}>
            <RemoveRedEyeOutlinedIcon
              style={{ fontSize: '1.4rem', color: 'rgb(112 112 113)' }}
            />
          </Link>

          <IconButton
            onClick={() => handleDelete(params.id as number)}
            aria-label="delete"
            style={{ marginBottom: '12px' }}
            disableRipple
            disableTouchRipple
          >
            <DeleteOutlineOutlinedIcon
              style={{
                fontSize: '1.4rem',
                color: '#db5756',
              }}
            />
          </IconButton>
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
          height: '400',
          width: '100%',
          backgroundColor: '#fff',
          paddingLeft: '10px',
          paddingRight: '10px',
          boxShadow: 2,
          borderRadius: '0.25rem',
        }}
        pageSizeOptions={[5, 10]}
      />
    </>
  );
}
