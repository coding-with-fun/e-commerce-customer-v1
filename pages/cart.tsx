import { PageLoader } from '@/HOC/AppWrapper';
import ProductsList from '@/components/Cart/ProductsList';
import { useAppSelector } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { cartProduct } from './api/cart/get-products';

const Cart = () => {
    const { cartData } = useAppSelector((state) => state.cart);

    const [productsData, setProductsData] = useState<cartProduct[]>([]);
    const [dataFetched, setDataFetched] = useState(false);

    const { trigger } = useSWRMutation('/api/cart/get-products', fetcher, {
        onError(err) {
            toast(err.message);
            setDataFetched(true);
        },
        onSuccess(data) {
            setProductsData(data.products);
            setDataFetched(true);
        },
    });

    useEffect(() => {
        const productIds = Object.keys(cartData).map((el) => +el);
        if (productIds.length && !dataFetched) {
            trigger({
                id: productIds,
            });
        } else {
            setDataFetched(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartData]);

    return !dataFetched ? (
        <PageLoader />
    ) : (
        <Fragment>
            <Head>
                <title>My Cart</title>
            </Head>

            <ProductsList products={productsData} />
        </Fragment>
    );
};

export default Cart;

type cartProductsApiResponse = {
    success: boolean;
    message: string;
    products: cartProduct[];
};

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
    const response: cartProductsApiResponse = await axiosInstance.post(url, {
        id: arg.id,
    });
    return response;
};
