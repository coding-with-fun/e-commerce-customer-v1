import prisma from '@/libs/prisma';
import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';
import requestValidator from '@/middlewares/requestValidator';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        const parsedData = (await requestValidator(
            req,
            schema
        )) as setProductQuantityToCartSchemaType;
        const {
            body: { quantity, productID, cartID },
        } = parsedData;

        const product = await prisma.product.findFirst({
            where: {
                id: productID,
                isActive: true,
                isDeleted: false,
            },
        });
        if (!product) {
            throw new Error('Product not found.');
        }

        const cart = await prisma.cart.findFirst({
            where: {
                cartId: cartID,
            },
        });
        if (!cart) {
            throw new Error('Cart not found.');
        }

        const session = await getServerSession(req, res, authOptions);
        if (session && +session.user.id !== cart.customerId) {
            if (!cart) {
                throw new Error('Cart not found.');
            }
        }

        await prisma.cart.update({
            where: {
                id: cart.id,
            },
            data: {
                quantity,
            },
        });

        return response(res, {
            message: 'Cart updated successfully.',
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
        productID: z.number({
            required_error: 'Product ID is required.',
            invalid_type_error: 'Product ID is required.',
        }),
        quantity: z.number({
            required_error: 'Product quantity is required.',
            invalid_type_error: 'Product quantity is required.',
        }),
        cartID: z
            .string({
                required_error: 'Cart ID is required.',
                invalid_type_error: 'Cart ID is required.',
            })
            .nonempty('Cart ID is required.'),
    }),
});

export type setProductQuantityToCartSchemaType = z.infer<typeof schema>;
