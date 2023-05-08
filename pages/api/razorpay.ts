import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        const razorpay = new Razorpay({
            key_id: 'rzp_test_EAchXsA0atVJwd',
            key_secret: 'lU3KSPozSMoUGKkB8i3bpgmZ',
        });

        const payment_capture = 1;
        const amount = 499;
        const currency = 'INR';

        const options = {
            amount: amount * 100,
            currency,
            receipt: '1234',
            payment_capture,
        };

        const response = await razorpay.orders.create(options);
        console.log({
            response,
        });
        return res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.log({
            error,
        });

        return response(res, null, error);
    }
};

export default handler;
