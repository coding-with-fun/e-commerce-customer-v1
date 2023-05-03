import prisma from '@/libs/prisma';
import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        await prisma.seller.deleteMany();
        await prisma.seller.create({
            data: SELLER,
        });

        return response(res, {
            message: 'Seller seeded successfully.',
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        prisma.$disconnect();
    }
};

export default handler;

const SELLER = {
    name: 'Dev Harrsh Seller',
    profilePicture: '',
    email: 'dev+seller@harrsh.com',
    password: '1234',
    contactNumber: '+919773195484',
};
