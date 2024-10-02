import { db } from '@/db';
import StockBuyFilters from '@/components/StockBuyFilters';
import StockBuyListTable from '@/components/StockBuyListTable';


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

export default async function BuyDashboardPage() {

    // 그리드에 표시할 데이터
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
        trans_no: stock.trans_no,
        accu_qty: stock.accu_qty,
    }));

    return (
        <>
            <StockBuyFilters />
            <StockBuyListTable stocks={stockData} />
        </>
    );
}
