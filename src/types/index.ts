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
  qty: string;
  unit_price: string;
  amount: string;
  status: string;
  created_by: string;
  from_store: string;
}