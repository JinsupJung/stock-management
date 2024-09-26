import { db } from '@/db';
import { StockData } from '@/types';
// import { getSelectedStore } from '@/context/StoreSelector'; // Ensure this is correct

export const POST = async (req: Request) => {
  try {

    const formData = await req.formData();
    const store_id = formData.get('store_id') as string;
    const transaction_date = formData.get('transaction_date') as string;
    const supply = formData.get('supply') as string;
    const stock_code = formData.get('stock_code') as string;
    const stock_name = formData.get('stock_name') as string;
    // const tax_yn = formData.get('tax_yn') as string;
    const specification = formData.get('specification') as string;
    const unit = formData.get('unit') as string;
    const qty = formData.get('qty') as string;
    const unit_price = formData.get('unit_price') as string;
    const amount = formData.get('amount') as string;
    // const status = formData.get('status') as string;
    const created_by = formData.get('created_by') as string;
    const tax_yn = '과세';
    const status = 'new';
    const from_store = '000000';

    // const { selectedStore } = useStores(); // Use store context for store_id

    // const store_id = selectedStore?.store_code || '';

    const stockData: StockData = {
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
      created_by,
      from_store,
    };

    console.log("POST stockData", stockData);

    await db.tbStockList.create({
      data: stockData,
    });

    return Response.redirect(`${process.env.NEXTAUTH_URL}/buy`);
  } catch (error) {
    console.log('Errors: ', error);
    return new Response(JSON.stringify({ message: 'error' }), { status: 500 });
  }
};

