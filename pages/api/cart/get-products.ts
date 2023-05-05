import prisma from '@/libs/prisma';
import response from '@/libs/response';
import requestValidator from '@/middlewares/requestValidator';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import z from 'zod';
import { authOptions } from '../auth/[...nextauth]';

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

        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            res.statusCode = 401;
            throw new Error('You are not authenticated.');
        }
        const userID = +session.user.id;

        const customer = await prisma.customer.findFirst({
            where: {
                id: userID,
            },
        });
        if (!customer) {
            res.statusCode = 400;
            throw new Error('Customer not found with the given ID.');
        }

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
