import Header from '@/components/CheckOut/Header';
import { useAppSelector } from '@/hooks/redux';
import Head from 'next/head';
import React, { Fragment, useEffect } from 'react';
import { Box } from '@mui/material';

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

            <Fragment>
                <Header />
            </Fragment>
        </Fragment>
    );
};

export default CheckOut;
