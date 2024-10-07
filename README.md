# 놀부 직영 매장 재고 관리 프로그램

## Project Overview

1. 매장 식재료 사입관리
2. 매장간 재고 이동
3. 월말 재고 실사 기록

## Learn CRUD Operations

- **Create**: Add new products.
- **Read**: Display products.
- **Update**: Modify existing products.
- **Delete**: Remove products.

## Project Structure

- `src/`: Folder for source code of the application.
- `app/`: Houses the main application logic, including API routing and pages.
- `components/`: Contains reusable React components used across different parts of the application.
- `config/`: Contains configuration files for various parts of your application, such as settings.
- `db/`: Contains database connection handlers.
- `utils/`: Contains utility functions or helper functions used across the application.
- `types/`: Holds TypeScript type definitions for application, enhancing type safety and code maintainability.
- `actions/`: Contains action functions responsible for triggering specific actions within your application such as API requests.
- `prisma/`: Contains Prisma-related files such as schema definitions and migrations.
- `public/`: Contains static assets like images, fonts, or other files that need to be publicly accessible. These assets are typically served directly by the server without any processing.

## Installation Instructions

Clone the repository to your local machine:

```bash
git https://github.com/JinsupJung/stock-management.git
```

Change into project directory

```bash
cd stock-management
```

Install Dependencies:

```bash
npm install
```

Environment Setup:

`Note:` Create a .env file in the root directory and add the following:

```bash
NEXTAUTH_URL= 'http://localhost:3000'
DATABASE_URL="<your-mysql-database-connection-string>"
```

Initialize the Database:

```bash
npx prisma migrate dev
```

Running the project:

```bash
npm run dev
```

## Run project:

http://stock.nolboo.co.kr


## Tables
TbStore: 매장 마스터 
TbStoreProduct: 매장 취급 품목
TbStoreStock: 매장 현재고
TbStockList: 트랙잭션 기록
