import prisma from '@/libs/prisma';
import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        await prisma.customer.deleteMany();
        await prisma.customer.create({
            data: CUSTOMER,
        });

        return response(res, {
            message: 'Customer seeded successfully.',
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        prisma.$disconnect();
    }
};

export default handler;

const CUSTOMER = {
    name: 'Harrsh Patel',
    profilePicture: '',
    email: 'dev@harrsh.com',
    password: '1234',
    contactNumber: '+919099976321',
};
