import PRODUCTS from '@/data/products';
import prisma from '@/libs/prisma';
import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        const seller = await prisma.seller.findFirst();
        if (!seller) {
            throw new Error('Seller not found.');
        }

        await prisma.product.deleteMany();

        for (let product of PRODUCTS) {
            await prisma.product.create({
                data: {
                    ...product,
                    sellerId: seller.id,
                },
            });
        }

        return response(res, {
            message: 'Products seeded successfully.',
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        prisma.$disconnect();
    }
};

export default handler;
