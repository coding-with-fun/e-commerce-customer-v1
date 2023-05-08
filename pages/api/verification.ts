import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        const secret = '12345678';

        console.log(req.body);

        const crypto = require('crypto');

        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        console.log(digest, req.headers['x-razorpay-signature']);

        return res.json({
            status: 'ok',
        });
    } catch (error) {
        return res.json({
            status: 'error',
        });
    }
};

export default handler;
