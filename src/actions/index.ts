'use server';

import { db } from '@/db';
import { redirect } from 'next/navigation';


export async function stockMove(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const store_id = formData.get('store_id') as string;
  const transaction_date = formData.get('transaction_date') as string;
  const supply = formData.get('supply') as string;
  const stock_code = formData.get('stock_code') as string;
  const stock_name = formData.get('stock_name') as string;
  const tax_yn = formData.get('tax_yn') as string;
  const specification = formData.get('specification') as string;
  const unit = formData.get('unit') as string;
  const qty = formData.get('qty') as string;
  const unit_price = formData.get('unit_price') as string;
  const amount = formData.get('amount') as string;
  const status = formData.get('status') as string;
  const from_store = formData.get('from_store') as string;
  const created_by = formData.get('created_by') as string;




  await db.tbStockList.update({
    where: {
      id: id,
    },
    data: {
      store_id,
      transaction_date,
      supply,
      stock_code,
      stock_name,
      tax_yn,
      specification,
      unit,
      qty,
      unit_price,
      amount,
      status,
      from_store,
      created_by,
    },
  });

  redirect('/admin');
}

export async function productEdit(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const quantity = parseInt(formData.get('quantity') as string);
  const description = formData.get('description') as string;


  await db.product.update({
    where: {
      id: id,
    },
    data: {
      name,
      price,
      quantity,
      description,
    },
  });

  redirect('/admin');
}

export async function productDelete(productId: number) {
  // delete image from cloudinary
  const currentProduct = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  // delete image from database
  await db.product.delete({
    where: {
      id: productId,
    },
  });

  redirect('/admin');
}
