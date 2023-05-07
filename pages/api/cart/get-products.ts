import prisma from '@/libs/prisma';
import response from '@/libs/response';
import requestValidator from '@/middlewares/requestValidator';
import { product, seller } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
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

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: id,
                },
            },
            include: {
                seller: true,
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

const schema = z.object({
    body: z.object({
        id: z
            .number()
            .array()
            .min(1, 'At least one product ID is required.')
            .nonempty('At least one product ID is required.'),
    }),
});

export type productToggleFavoriteSchemaType = z.infer<typeof schema>;

export type cartProduct = product & {
    seller: seller | null;
};
