// /app/api/inven/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { store_id, transaction_date, stock_code, stock_name, qty, created_by } = body;

    // 데이터 유효성 검사
    if (!store_id || !transaction_date || !stock_code || !stock_name || qty === undefined || !created_by) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 날짜 형식 검증
    if (!dayjs(transaction_date, 'YYYY-MM-DD', true).isValid()) {
      return NextResponse.json(
        { message: '올바른 날짜 형식을 입력해주세요. (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // 중복 검사 (store_id, stock_code, transaction_date 기준)
    const existingRecord = await db.tbStoreInven.findFirst({
      where: {
        store_id,
        stock_code,
        transaction_date,
      },
    });

    if (existingRecord) {
      return NextResponse.json(
        { message: '이미 해당 날짜에 동일한 품목이 존재합니다.' },
        { status: 400 }
      );
    }

    // qty를 Decimal로 변환
    const qtyDecimal = new Prisma.Decimal(qty);

    // 레코드 생성
    const newRecord = await db.tbStoreInven.create({
      data: {
        store_id,
        transaction_date,
        stock_code,
        stock_name,
        qty: qtyDecimal,
        created_by,
      },
    });

    console.log('Inserted new inventory record');

    return NextResponse.json(
      { success: true, message: '재고 실사 기록이 성공적으로 저장되었습니다.', data: newRecord },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error inserting inventory:', error);
    return NextResponse.json(
      { message: '재고 실사 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();

    const { id, store_id, transaction_date, stock_code, stock_name, qty, created_by } = body;

    // 데이터 유효성 검사
    if (!id || !store_id || !transaction_date || !stock_code || !stock_name || qty === undefined || !created_by) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 날짜 형식 검증
    if (!dayjs(transaction_date, 'YYYY-MM-DD', true).isValid()) {
      return NextResponse.json(
        { message: '올바른 날짜 형식을 입력해주세요. (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // qty를 Decimal로 변환
    const qtyDecimal = new Prisma.Decimal(qty);

    // 레코드 업데이트
    const updatedRecord = await db.tbStoreInven.update({
      where: { id },
      data: {
        store_id,
        transaction_date,
        stock_code,
        stock_name,
        qty: qtyDecimal,
        created_by,
      },
    });

    console.log('Updated inventory record');

    return NextResponse.json(
      { success: true, message: '재고 실사 기록이 성공적으로 수정되었습니다.', data: updatedRecord },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error updating inventory:', error);
    return NextResponse.json(
      { message: '재고 실사 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
