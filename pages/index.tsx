import NoProduct from '@/components/Home/NoProduct';
import Product from '@/components/Home/Product';
import ProductsSkeleton from '@/components/Home/ProductsSkeleton';
import toast from '@/libs/toast';
import { Box } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import { Fragment } from 'react';
import useSWR from 'swr';
import { productListResponse } from './api/product/list';

const Home = () => {
    const {
        data,
        isLoading,
    }: {
        data: productListApiResponse | undefined;
        isLoading: boolean;
    } = useSWR('/api/product/list', productsFetcher);

    if (!data || (data.products && !data.products.length)) {
        if (!isLoading) {
            return <NoProduct />;
        } else {
            return <ProductsSkeleton />;
        }
    }

    const { message, products, success } = data;

    if (!isLoading && !success) {
        toast(message);
        return <NoProduct />;
    }

    return (
        <Fragment>
            <Head>
                <title>Home</title>
            </Head>

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 'calc(100vw - 48px)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '1rem',
                }}
            >
                {products.map((product) => {
                    return <Product key={product.id} product={product} />;
                })}
            </Box>
        </Fragment>
    );
};

export default Home;

const productsFetcher = (url: string) => axios.get(url).then((res) => res.data);

type productListApiResponse = {
    success: boolean;
    message: string;
    products: productListResponse[];
};

export const getServerSideProps = async () => {
    const res = await fetch('http://localhost:3000/api/product/list');
    const data: productListApiResponse = await res.json();

    console.log(data);

    return {
        props: {
            data,
        },
    };
};
