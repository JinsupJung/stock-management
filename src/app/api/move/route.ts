import { db } from '@/db';

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();


        // Parse the form data
        const moveQty = Number(formData.get('qty')); // Moved quantity
        const fromStoreId = formData.get('from_store') as string;
        const toStoreId = formData.get('store_id') as string;
        const stockCode = formData.get('stock_code') as string;


        // 1. Fetch the stock details from TbStoreStock
        const storeStock = await db.tbStoreStock.findFirst({
            where: { store_id: fromStoreId, stock_code: stockCode },
        });

        if (!storeStock) {
            return new Response(JSON.stringify({ message: 'TbStoreStock stock not found' }), { status: 404 });
        }

        // 2. Check if the moveQty is valid (less than or equal to available stock in Store A)
        if (moveQty > storeStock.current_qty) {
            return new Response(JSON.stringify({ message: 'Not enough stock' }), { status: 400 });
        }

        // 누적 수량 계산 필요
        const newRecord = {
            store_id: formData.get('store_id') as string,
            transaction_date: formData.get('transaction_date') as string,
            supply: formData.get('supply') as string,
            stock_code: formData.get('stock_code') as string,
            stock_name: formData.get('stock_name') as string,
            specification: formData.get('specification') as string,
            unit: formData.get('unit') as string,
            qty: Number(formData.get('qty')),
            unit_price: Number(formData.get('unit_price')),
            amount: Number(formData.get('amount')),
            created_by: formData.get('created_by') as string,
            from_store: formData.get('from_store') as string,
            trans_no: Number(formData.get('trans_no')),
            accu_qty: Number(formData.get('accu_qty')),
            status: 'move',
        };



        const updateRecord = {
            id: Number(formData.get('id')),
            current_qty: Number(formData.get('qty')),
        };



        console.log("newRecord.qty, updateRecord.qty =", newRecord.qty, updateRecord.current_qty);
        console.log("newRecord, updateRecord =", newRecord, updateRecord);


        // 1. Insert new record
        await db.tbStockList.create({
            data: {
                ...newRecord,
                tax_yn: '과세',
                status: 'move',
            },
        });

        // 2. Update existing record
        await db.tbStoreStock.update({
            where: { id: updateRecord.id },
            data: {
                current_qty: updateRecord.current_qty,
            },
        });

        // Return a JSON response and handle redirection on the frontend
        return new Response(JSON.stringify({ success: true, message: "Success" }), {
            status: 200,
        });
        return Response.redirect(`${process.env.NEXTAUTH_URL}/move`);

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'error' }), { status: 500 });
    }
};
