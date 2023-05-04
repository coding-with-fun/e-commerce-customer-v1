import axios from 'axios';
import Product from '@/components/Home/Product';
import { Box } from '@mui/material';
import Head from 'next/head';
import { Fragment } from 'react';
import { productListResponse } from './api/product/list';
import toast from '@/libs/toast';
import NoProduct from '@/components/Home/NoProduct';

const Home = ({ data }: { data: productListApiResponse }) => {
    const { message, products, success } = data;

    if (!success) {
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
                    marginX: 'auto',
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

type productListApiResponse = {
    success: boolean;
    message: string;
    products: productListResponse[];
};

export const getServerSideProps = async () => {
    const res = await axios.get('http://localhost:3000/api/product/list');
    const data: productListApiResponse = res.data;

    return {
        props: {
            data,
        },
    };
};
