import React from 'react';
import { TbStockList } from '@prisma/client';
import { db } from '@/db';
import { notFound } from 'next/navigation';
import StockMoveForm from '@/components/StockMoveForm';

interface StockMovePageProps {
  params: {
    stockId: string;
  };
}

export default async function StockMovePage(props: StockMovePageProps) {
  const stockId = parseInt(props.params.stockId);

  let stock: TbStockList | null = await db.tbStockList.findUnique({
    where: {
      id: stockId,
    },
  });

  if (!stock) {
    return notFound();
  }

  const plainStock = {
    id: stock.id,
    store_id: stock.store_id,
    transaction_date: stock.transaction_date,
    supply: stock.supply,
    stock_code: stock.stock_code,
    stock_name: stock.stock_name,
    tax_yn: stock.tax_yn,
    specification: stock.specification,
    unit: stock.unit,
    qty: stock.qty,
    unit_price: stock.unit_price,
    amount: stock.amount,
    status: stock.status,
    from_store: stock.from_store,
    created_by: stock.created_by,
  };

  return (
    <>
      <StockMoveForm stock={plainStock} />
    </>
  );
}
