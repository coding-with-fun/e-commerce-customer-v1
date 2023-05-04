import NoProduct from '@/components/Home/NoProduct';
import Product from '@/components/Home/Product';
import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Head from 'next/head';
import { Fragment } from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import { productListResponse } from './api/product/list';

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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const res: productListApiResponse = await axiosInstance.get(
        'http://localhost:3000/api/product/list'
    );

    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );

    const products = [];
    for (let product of res.products) {
        const isFavorite =
            session && product.favoriteBy
                ? product.favoriteBy.some((el) => el.id === +session.user.id)
                : false;

        delete product.favoriteBy;
        products.push({
            ...product,
            isFavorite,
        });
    }

    return {
        props: {
            data: {
                ...res,
                products,
            },
            session,
        },
    };
};
