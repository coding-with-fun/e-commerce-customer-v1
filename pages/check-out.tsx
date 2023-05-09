import CheckOutLeft from '@/components/CheckOut/CheckOutLeft';
import CheckOutRight from '@/components/CheckOut/CheckOutRight';
import { useAppSelector } from '@/hooks/redux';
import { Box } from '@mui/material';
import Head from 'next/head';
import { Fragment, useEffect } from 'react';

const CheckOut = () => {
    const { cartData } = useAppSelector((state) => state.cart);

    useEffect(() => {
        console.log(cartData);
    }, [cartData]);

    return (
        <Fragment>
            <Head>
                <title>Checkout</title>
            </Head>

            <Box className="flex px-[4rem]">
                <CheckOutLeft />
                <CheckOutRight />
            </Box>
        </Fragment>
    );
};

export default CheckOut;
