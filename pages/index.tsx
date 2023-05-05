import { GetServerSideProps } from 'next';
import React, { Fragment, useEffect } from 'react';
import { productListResponse } from './api/product/list';
import axiosInstance from '@/libs/interceptor';
import env from '@/utils/env';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setProducts } from '@/redux/slice/products.slice';
import { useSession } from 'next-auth/react';
import toast from '@/libs/toast';
import NoProduct from '@/components/Home/NoProduct';
import Head from 'next/head';
import { Box } from '@mui/material';

const Home = ({ data }: { data: productListApiResponse }) => {
    const { data: session } = useSession();
    const products = useAppSelector((state) => state.products.products);
    const dispatch = useAppDispatch();

    const { message, products: resProducts, success } = data;

    useEffect(() => {
        const data = [];

        for (let product of resProducts) {
            const productData = {
                ...product,
            };

            const isFavorite =
                session && productData.favoriteBy
                    ? productData.favoriteBy.some(
                          (el) => el.id === +session.user.id
                      )
                    : false;

            delete productData.favoriteBy;
            data.push({
                ...productData,
                isFavorite,
            });
        }

        dispatch(
            setProducts({
                products: data,
            })
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resProducts]);

    if (!success) {
        toast(message);
        return <NoProduct />;
    }

    if (!products.length) {
        return <NoProduct />;
    }

    return (
        <Fragment>
            <Head>
                <title>Home</title>
            </Head>

            <Box>Home</Box>
        </Fragment>
    );
};

export default Home;

type productListApiResponse = {
    success: boolean;
    message: string;
    products: productListResponse[];
    pagination: {
        page: number;
        perPage: number;
        total: number;
    };
};

const fetcher = async (page = 1, perPage = 10, query = '') => {
    const res: productListApiResponse = await axiosInstance.get(
        `${env.baseURL}/api/product/list?page=${page}&perPage=${perPage}&query=${query}`
    );

    return res;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const res: productListApiResponse = await fetcher();

        return {
            props: {
                data: res,
            },
        };
    } catch (error: any) {
        return {
            props: {
                data: {
                    ...error,
                    products: [],
                },
            },
        };
    }
};
