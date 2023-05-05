import { PageLoader } from '@/HOC/AppWrapper';
import { useAppSelector } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import Head from 'next/head';
import React, { Fragment, useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';

const Cart = () => {
    const { cartData } = useAppSelector((state) => state.cart);

    const { trigger, isMutating, data } = useSWRMutation(
        '/api/cart/get-products',
        fetcher,
        {
            onSuccess() {
                setFetchingProducts(false);
            },
        }
    );

    const [fetchingProducts, setFetchingProducts] = useState(true);

    const handleFetchProducts = async () => {
        const cartIds = Object.keys(cartData);
        const intCartIds = cartIds.map((el) => +el);

        trigger({
            id: intCartIds,
        });
    };

    useEffect(() => {
        handleFetchProducts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartData]);

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <Fragment>
            <Head>
                <title>Cart</title>
            </Head>

            {fetchingProducts ? <PageLoader /> : <div>Cart</div>}
        </Fragment>
    );
};

export default Cart;

const fetcher = async (
    url: string,
    {
        arg,
    }: {
        arg: {
            id: number[];
        };
    }
) => {
    const response = await axiosInstance.post(url, {
        id: arg.id,
    });

    return response;
};
