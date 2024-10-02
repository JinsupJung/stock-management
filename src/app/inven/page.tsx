import { db } from '@/db';
import StockInvenFilters from '@/components/StockInvenFilters';
import StockInvenListTable from '@/components/StockInvenListTable';

interface StoreInvenProps {
    id: number;
    store_id: string;
    stock_code: string;
    stock_name: string;
    qty: number;
    transaction_date: string;
}


export default async function MoveDashboardPage() {
    // const stocks: StockProps[] = await db.tbStockList.findMany();
    const storeInvens: StoreInvenProps[] = await db.tbStoreInven.findMany();

    const storeInvenData: StoreInvenProps[] = storeInvens.map((storeInven) => ({
        id: storeInven.id,
        store_id: storeInven.store_id,
        stock_code: storeInven.stock_code,
        stock_name: storeInven.stock_name,
        qty: storeInven.qty,
        transaction_date: storeInven.transaction_date,
    }));

    return (
        <>
            <StockInvenFilters />
            <StockInvenListTable invens={storeInvenData} />
        </>
    );
}
