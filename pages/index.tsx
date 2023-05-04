import axios from 'axios';
import Product from '@/components/Home/Product';
import { Box } from '@mui/material';
import Head from 'next/head';
import { Fragment } from 'react';
import { productListResponse } from './api/product/list';
import toast from '@/libs/toast';
import NoProduct from '@/components/Home/NoProduct';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { GetServerSideProps } from 'next';

const Home = ({ data }: { data: productListApiResponse }) => {
    const { message, products, success } = data;

    if (!success) {
        toast(message);
        return <NoProduct />;
    }

    console.log(products);

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
    const res = await axios.get('http://localhost:3000/api/product/list');
    const data: productListApiResponse = res.data;

    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );
    console.log(session);

    const products = [];
    for (let product of data.products) {
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

    console.log(products);

    return {
        props: {
            data: {
                ...data,
                products,
            },
            session,
        },
    };
};
