import axiosInstance from '@/libs/interceptor';
import env from '@/utils/env';
import { GetServerSideProps } from 'next';
import { productDetailsResponse } from '../api/product/details/[id]';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from '@/libs/toast';
import NoProduct from '@/components/Product/Details/NoProduct';

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

    return <div>Product</div>;
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
        const res: productDetailsApiResponse = await fetcher(id as string);

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
