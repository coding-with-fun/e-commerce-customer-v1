import prisma from '@/libs/prisma';
import response from '@/libs/response';
import { product } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'GET') {
            throw new Error('API not found!');
        }

        const products: productListResponse[] = await prisma.product.findMany({
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        return response(res, {
            message: 'Products fetched successfully.',
            products,
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

export type productListResponse = product & {
    seller: {
        id: number;
        name: string;
    } | null;
    favoriteBy?: {
        id: number;
    }[];
    isFavorite?: boolean;
};
