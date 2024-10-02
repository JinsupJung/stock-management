// /app/api/inven/update/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function POST(request: Request) {
    try {
        const { store_id } = await request.json();

        // TbStoreStock에서 해당 store_id와 매칭되는 재고 정보를 가져옴
        const invenItems = await db.tbStoreInven.findMany({
            where: { store_id },
        });

        // stockItems 배열을 순회하면서 TbStoreInven을 업데이트 또는 삽입
        for (const invenItem of invenItems) {
            const { stock_code, stock_name, qty } = invenItem;

            // TbStoreInven에서 이미 해당 store_id와 stock_code가 있는지 확인
            const stockRecord = await db.tbStoreStock.findFirst({
                where: { store_id, stock_code },
            });

            if (stockRecord) {
                // 기존 기록이 있으면 qty 업데이트
                await db.tbStoreStock.update({
                    where: { id: stockRecord.id },
                    data: { current_qty: qty }, // TbStoreStock의 current_qty를  재고실사 데이터로 업데이트
                });
            } else {
                // 기존 기록이 없으면 새로 삽입
                await db.tbStoreStock.create({
                    data: {
                        store_id,
                        stock_code,
                        stock_name,
                        current_qty: qty, // TbStoreStock의 current_qty를 사용하여 새로 삽입
                        // transaction_date: new Date().toISOString().split('T')[0], // 오늘 날짜를 입력
                        // created_by: 'system', // 작성자 정보 (필요에 따라 변경)
                    },
                });
            }
        }

        return NextResponse.json({ success: true, message: '월말 재고 실사 업데이트 완료' });
    } catch (error) {
        console.error('Error updating inventory:', error);
        return NextResponse.json({ success: false, message: '재고 업데이트 실패' }, { status: 500 });
    }
}
