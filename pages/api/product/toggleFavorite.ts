import prisma from '@/libs/prisma';
import response from '@/libs/response';
import requestValidator from '@/middlewares/requestValidator';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import z from 'zod';
import { authOptions } from '../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const startTime = Date.now();
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        const parsedData = (await requestValidator(
            req,
            schema
        )) as productToggleFavoriteSchemaType;
        const {
            body: { id },
        } = parsedData;

        console.log(
            `1.) Async function took ${
                (Date.now() - startTime) / 1000
            } seconds to complete.`
        );

        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            res.statusCode = 401;
            throw new Error('You are not authenticated.');
        }
        const userID = +session.user.id;

        console.log(
            `2.) Async function took ${
                (Date.now() - startTime) / 1000
            } seconds to complete.`
        );

        const customer = await prisma.customer.findFirst({
            where: {
                id: userID,
            },
            include: {
                favoriteProduct: true,
            },
        });

        console.log(
            `3.) Async function took ${
                (Date.now() - startTime) / 1000
            } seconds to complete.`
        );

        if (!customer) {
            res.statusCode = 400;
            throw new Error('Customer not found with the given ID.');
        }

        const isFavorite = customer.favoriteProduct.some((el) => el.id === id);

        console.log(
            `4.) Async function took ${
                (Date.now() - startTime) / 1000
            } seconds to complete.`
        );

        if (!isFavorite) {
            await prisma.customer.update({
                where: {
                    id: userID,
                },
                data: {
                    favoriteProduct: {
                        connect: {
                            id,
                        },
                    },
                },
            });
        } else {
            await prisma.customer.update({
                where: {
                    id: userID,
                },
                data: {
                    favoriteProduct: {
                        disconnect: {
                            id,
                        },
                    },
                },
            });
        }

        const msElapsed = Date.now() - startTime;
        console.log(
            `5.) Async function took ${msElapsed / 1000} seconds to complete.`
        );

        return response(res, {
            message: 'Status updated successfully.',
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

const schema = z.object({
    body: z.object({
        id: z.number({
            required_error: 'Product ID is required.',
            invalid_type_error: 'Product ID is required.',
        }),
    }),
});

export type productToggleFavoriteSchemaType = z.infer<typeof schema>;
