import { NextResponse } from 'next/server';
import { db } from '@/db';


export async function GET(request: Request) {
    try {
        // tbStoreProduct 테이블에서 모든 데이터 조회
        const products = await db.tbStoreProduct.findMany();

        // const products = [
        //     { stock_code: 'P001', stock_name: 'Product 1', specification: 'Spec 1', unit: 'Unit 1' },
        //     { stock_code: 'P002', stock_name: 'Product 2', specification: 'Spec 2', unit: 'Unit 2' },
        //     { stock_code: 'P003', stock_name: 'Product 3', specification: 'Spec 3', unit: 'Unit 3' }
        // ];

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
