import React from 'react';
import { TbStockList } from '@prisma/client';
import { db } from '@/db';
import { notFound } from 'next/navigation';
import StockEditForm from '@/components/StockEditForm';

interface StockEditPageProps {
  params: {
    stockId: string;
  };
}

export default async function StockEditPage(props: StockEditPageProps) {
  // const stockId = parseInt(props.params.stockId);

  const { stockId } = props.params;

  if (!stockId || isNaN(Number(stockId))) {
    console.error("Invalid stockId:", stockId);
    return notFound();
  }

  const stockIdInt = parseInt(stockId, 10);


  // console.log("params", props.params);
  // console.log("stockId", props.params.stockId);


  let stock: TbStockList | null = await db.tbStockList.findUnique({
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
    supply: stock.supply,
    stock_code: stock.stock_code,
    stock_name: stock.stock_name,
    tax_yn: stock.tax_yn,
    specification: stock.specification,
    unit: stock.unit,
    qty: stock.qty,            // Convert qty
    unit_price: stock.unit_price, // Convert unit_price
    amount: stock.amount,       // Convert amount
    status: stock.status,
    from_store: stock.from_store,
    created_by: stock.created_by,
    trans_no: stock.trans_no,
    accu_qty: stock.accu_qty,
  };

  return (
    <>
      <StockEditForm stock={plainStock} />
    </>
  );
}
