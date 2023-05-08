import { PageLoader } from '@/HOC/AppWrapper';
import Details from '@/components/Product/Details';
import NoProduct from '@/components/Product/Details/NoProduct';
import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import env from '@/utils/env';
import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import { productDetailsResponse } from '../api/product/details/[id]';

const Product = ({ data }: { data: productDetailsApiResponse }) => {
    const { data: session } = useSession();

    const [product, setProduct] = useState<productDetailsResponse>();

    const { message, product: resProduct, success } = data;

    useEffect(() => {
        const tempProduct = {
            ...resProduct,
        };

        tempProduct.isFavorite =
            session && tempProduct.favoriteBy
                ? tempProduct.favoriteBy.some(
                      (el) => el.id === +session.user.id
                  )
                : false;
        delete tempProduct.favoriteBy;

        setProduct({
            ...tempProduct,
        });
    }, [resProduct, session]);

    if (!success) {
        toast(message);
        return <NoProduct />;
    }

    return product ? (
        <Fragment>
            <Head>
                <title>{product.title}</title>
            </Head>

            <Details product={product} />
        </Fragment>
    ) : (
        <PageLoader />
    );
};

export default Product;

type productDetailsApiResponse = {
    success: boolean;
    message: string;
    product: productDetailsResponse;
};

const fetcher = async (id: string) => {
    const res: productDetailsApiResponse = await axiosInstance.get(
        `${env.baseURL}/api/product/details/${id}`
    );

    return res;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { id } = context.query;
        const productID = (id as string).split('-').pop() as string;
        const res: productDetailsApiResponse = await fetcher(productID);

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
