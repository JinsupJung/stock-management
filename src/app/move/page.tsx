import { db } from '@/db';
import StockMoveFilters from '@/components/StockMoveFilters';
import StockMoveListTable from '@/components/StockMoveListTable';

interface StockProps {
    id: number;
    store_id: string;
    transaction_date: string;
    supply: string;
    stock_code: string;
    stock_name: string;
    tax_yn: string;
    specification: string;
    unit: string;
    qty: number;
    unit_price: number;
    amount: number;
    status: string;
    from_store: string;
    created_by: string;
    trans_no: number;
    accu_qty: number;
}


interface StoreStockProps {
    id: number;
    store_id: string;
    stock_code: string;
    stock_name: string;
    current_qty: number;
}

export default async function MoveDashboardPage() {
    // const stocks: StockProps[] = await db.tbStockList.findMany();
    const storeStocks: StoreStockProps[] = await db.tbStoreStock.findMany();

    const storeStockData: StoreStockProps[] = storeStocks.map((storeStock) => ({
        id: storeStock.id,
        store_id: storeStock.store_id,
        stock_code: storeStock.stock_code,
        stock_name: storeStock.stock_name,
        current_qty: storeStock.current_qty,
    }));

    return (
        <>
            <StockMoveFilters />
            <StockMoveListTable stocks={storeStockData} />
        </>
    );
}
