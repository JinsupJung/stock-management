import { db } from '@/db';
import { InvenData } from '@/types';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();  // JSON 형식으로 요청 데이터를 처리

    const { store_id, transaction_date, stock_code, stock_name, qty, created_by } = body;

    // Check if the record with same store_id and stock_code already exists
    const existingRecord = await db.tbStoreInven.findFirst({
      where: {
        store_id,
        stock_code,
      },
    });

    if (existingRecord) {
      // If the record exists, throw an error and do not insert
      return new Response(
        JSON.stringify({ message: 'Record already exists with this store_id and stock_code' }),
        { status: 400 }
      );
    }

    // Insert new record
    await db.tbStoreInven.create({
      data: {
        store_id,
        transaction_date,
        stock_code,
        stock_name,
        qty: Number(qty), // Ensure qty is a number
        created_by,
      },
    });

    console.log('Inserted new inventory record');

    // Redirect after successful operation
    return new Response(
      JSON.stringify({ success: true, message: 'Inserted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.log('Errors: ', error);
    return new Response(JSON.stringify({ message: 'error' }), { status: 500 });
  }
};
