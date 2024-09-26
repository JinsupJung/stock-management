import { db } from '@/db';
import { TbStockList } from '@prisma/client';
import StockFilters from '@/components/StockFilters';
import StockListTable from '@/components/StockListTable';

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
    qty: string;
    unit_price: string;
    amount: string;
    status: string;
    from_store: string;
    created_by: string;
}

export default async function BuyDashboardPage() {
    const stocks: StockProps[] = await db.tbStockList.findMany();

    const stockData: StockProps[] = stocks.map((stock) => ({
        id: stock.id,
        store_id: stock.store_id,
        transaction_date: stock.transaction_date,
        supply: stock.supply,
        stock_code: stock.stock_code,
        stock_name: stock.stock_name,
        tax_yn: stock.tax_yn,
        specification: stock.specification,
        unit: stock.unit,
        qty: stock.qty,
        unit_price: stock.unit_price,
        amount: stock.amount,
        status: stock.status,
        from_store: stock.from_store,
        created_by: stock.created_by,
    }));

    return (
        <>
            <StockFilters />
            <StockListTable stocks={stockData} />
        </>
    );
}
