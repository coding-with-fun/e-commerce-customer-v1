import prisma from '@/libs/prisma';
import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'GET') {
            throw new Error('API not found!');
        }

        const products = await prisma.product.findMany({
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                favoriteBy: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        return response(res, {
            message: 'Products fetched successfully.',
            products,
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        prisma.$disconnect();
    }
};

export default handler;
