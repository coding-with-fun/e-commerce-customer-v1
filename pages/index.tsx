import { GetServerSideProps } from 'next';
import React from 'react';
import { productListResponse } from './api/product/list';
import axiosInstance from '@/libs/interceptor';
import env from '@/utils/env';

const Home = ({ data }: { data: productListApiResponse }) => {
    console.log(data);

    return <div>Home</div>;
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
