import { db } from '@/db';
import { ProductData } from '@/types';
import { RESPONSE_LIMIT_DEFAULT } from 'next/dist/server/api-utils';
import { LocalFlorist } from '@mui/icons-material';

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const quantity = parseInt(formData.get('quantity') as string);
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;
    const status = '';

    const productData: ProductData = {
      name,
      description,
      price,
      quantity,
      status,
      imageUrl: '',
    };


    await db.product.create({
      data: productData,
    });

    return Response.redirect(`${process.env.NEXTAUTH_URL}/admin`);
  } catch (error) {
    console.log('Errors: ', error);
    return new Response(JSON.stringify({ message: 'error' }), { status: 500 });
  }
};
