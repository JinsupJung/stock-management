import React from 'react';
import { TbStoreStock } from '@prisma/client';
import { db } from '@/db';
import { notFound } from 'next/navigation';
import StockMoveForm from '@/components/StockMoveForm';
import { useStores } from '@/context/StoresContext'; // Custom context for selected store


interface StockMovePageProps {
  params: {
    stockId: string;
  };
}

export default async function StockMovePage(props: StockMovePageProps) {
  // const stockId = parseInt(props.params.stockId);
  // const { selectedStore, setSelectedStore } = useStores();

  const { stockId } = props.params;

  if (!stockId || isNaN(Number(stockId))) {
    console.error("Invalid stockId:", stockId);
    return notFound();
  }

  const stockIdInt = parseInt(stockId, 10);


  // console.log("params", props.params);
  // console.log("stockId", props.params.stockId);


  let stock: TbStoreStock | null = await db.tbStoreStock.findUnique({
    where: {
      id: stockIdInt,
    },
  });

  if (!stock) {
    return notFound();
  }

  // const store_code = selectedStore?.store_code || ''; // Read only from context



  const plainStock = {
    id: stock.id,
    store_id: stock.store_id,
    stock_code: stock.stock_code,
    stock_name: stock.stock_name,
    current_qty: stock.current_qty,
  };

  return (
    <>
      <StockMoveForm stock={plainStock} />
    </>
  );
}
