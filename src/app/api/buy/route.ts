// /app/api/buy/route.ts

import { db } from '@/db';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();

    // Get the id from formData to determine if it's an update
    const id = formData.get('id') as string | null;

    const store_id = formData.get('store_id') as string;
    const transaction_date = formData.get('transaction_date') as string;
    const supply = formData.get('supply') as string;
    const stock_code = formData.get('stock_code') as string;
    const stock_name = formData.get('stock_name') as string;
    const specification = formData.get('specification') as string;
    const unit = formData.get('unit') as string;
    const qtyStr = formData.get('qty') as string;
    const unit_priceStr = formData.get('unit_price') as string;
    const amountStr = formData.get('amount') as string;
    const created_by = formData.get('created_by') as string;
    const tax_yn = formData.get('tax_yn') as string; // 클라이언트에서 받은 값 사용
    const status = formData.get('status') as string;
    const from_store = '000000'; // 예시 하드코딩 값

    // 필요한 경우 trans_no와 accu_qty 값을 처리합니다.
    const trans_no = Number(formData.get('trans_no') || '0');
    const accu_qty = Number(formData.get('accu_qty') || '0');

    console.log('status = ', status);
    console.log('accu_qty = ', accu_qty);

    // qty, unit_price, amount를 숫자로 변환
    const qty = parseFloat(qtyStr);
    const unit_price = parseInt(unit_priceStr, 10);
    const amount = parseInt(amountStr, 10);

    const stockData = {
      store_id,
      transaction_date,
      supply,
      stock_code,
      stock_name,
      tax_yn,
      specification,
      unit,
      qty, // 숫자 타입 사용
      unit_price, // 숫자 타입 사용
      amount, // 숫자 타입 사용
      status,
      created_by,
      from_store,
      trans_no,
      accu_qty,
    };

    // Check if the `id` is provided to determine if it's an update or insert
    if (id) {
      // Update existing record
      await db.tbStockList.update({
        where: { id: Number(id) },
        data: stockData,
      });
      console.log(`Updated stock record with id: ${id}`);
    } else {
      // Insert new record
      await db.tbStockList.create({
        data: stockData,
      });
      console.log('Inserted new stock record');
    }

    // 성공적으로 처리된 후 리다이렉트 또는 응답 반환
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/buy`);
  } catch (error) {
    console.log('Errors: ', error);
    return NextResponse.json({ message: 'error', error }, { status: 500 });
  }
};
