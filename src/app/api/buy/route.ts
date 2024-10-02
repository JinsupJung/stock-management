import { db } from '@/db';
import { StockData } from '@/types';

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
    const qty = formData.get('qty') as string;
    const unit_price = formData.get('unit_price') as string;
    const amount = formData.get('amount') as string;
    const created_by = formData.get('created_by') as string;
    const tax_yn = '과세'; // Example hardcoded value
    const status = 'new'; // Example hardcoded value
    const from_store = '000000'; // Example hardcoded value

    //수정해야 됨
    const trans_no = Number(formData.get('qty'));
    const accu_qty = Number(formData.get('qty'));


    const stockData: StockData = {
      store_id,
      transaction_date,
      supply,
      stock_code,
      stock_name,
      tax_yn,
      specification,
      unit,
      qty: Number(qty), // Convert qty to a number
      unit_price: Number(unit_price), // Convert unit_price to a number
      amount: Number(amount), // Convert amount to a number
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
        where: { id: Number(id) }, // Use the id for the update operation
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

    // Redirect after successful operation
    return Response.redirect(`${process.env.NEXTAUTH_URL}/buy`);
  } catch (error) {
    console.log('Errors: ', error);
    return new Response(JSON.stringify({ message: 'error' }), { status: 500 });
  }
};
