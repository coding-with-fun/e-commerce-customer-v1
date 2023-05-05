import prisma from '@/libs/prisma';
import response from '@/libs/response';
import pagination from '@/middlewares/cleanPagination';
import { product } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'GET') {
            throw new Error('API not found!');
        }

        const { page, perPage, query } = pagination(req);

        const [products, count]: [productListResponse[], number] =
            await Promise.all([
                prisma.product.findMany({
                    where: {
                        isActive: true,
                        isDeleted: false,
                        AND: {
                            OR: [
                                {
                                    title: {
                                        contains: query,
                                    },
                                },
                                {
                                    seller: {
                                        name: {
                                            contains: query,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    include: {
                        seller: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        favoriteBy: {
                            where: {
                                isActive: true,
                                isDeleted: false,
                            },
                            select: {
                                id: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    skip: (page - 1) * perPage,
                    take: perPage,
                }),

                prisma.product.count({
                    where: {
                        isActive: true,
                        isDeleted: false,
                        AND: {
                            OR: [
                                {
                                    title: {
                                        contains: query,
                                    },
                                },
                                {
                                    seller: {
                                        name: {
                                            contains: query,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                }),
            ]);

        return response(res, {
            message: 'Products fetched successfully.',
            products,
            pagination: {
                page,
                perPage,
                total: count,
            },
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
