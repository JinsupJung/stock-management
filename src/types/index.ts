export interface ProductData {
  name: string;
  description: string;
  price: string;
  quantity: number;
  status: string;
  imageUrl: string;
}


export interface StockData {
  // id: number;
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
  created_by: string;
  from_store: string;
  trans_no: number;
  accu_qty: number;
}

export interface InvenData {
  store_id: string;
  transaction_date: string | Date;
  stock_code: string;
  stock_name: string;
  qty: number | '';
  created_by: string;
}