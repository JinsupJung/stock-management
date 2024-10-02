import React from 'react';
import { TbStoreInven } from '@prisma/client';
import { db } from '@/db';
import { notFound } from 'next/navigation';
import StockInvenEditForm from '@/components/StockInvenEditForm';

interface InvenEditPageProps {
  params: {
    stockId: string;
  };
}

export default async function InvenEditPage(props: InvenEditPageProps) {
  // const stockId = parseInt(props.params.stockId);

  const { stockId } = props.params;

  if (!stockId || isNaN(Number(stockId))) {
    console.error("Invalid stockId:", stockId);
    return notFound();
  }

  const stockIdInt = parseInt(stockId, 10);


  // console.log("params", props.params);
  // console.log("stockId", props.params.stockId);


  let stock: TbStoreInven | null = await db.tbStoreInven.findUnique({
    where: {
      id: stockIdInt,
    },
  });

  if (!stock) {
    return notFound();
  }

  const plainStock = {
    id: stock.id,
    store_id: stock.store_id,
    transaction_date: stock.transaction_date,
    stock_code: stock.stock_code,
    stock_name: stock.stock_name,
    qty: stock.qty,            // Convert qty
    created_by: stock.created_by,
  };

  return (
    <>
      <StockInvenEditForm stock={plainStock} />
    </>
  );
}
