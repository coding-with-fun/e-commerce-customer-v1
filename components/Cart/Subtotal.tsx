import { useAppSelector } from '@/hooks/redux';
import { cartProduct } from '@/pages/api/cart/get-products';
import { Box, ButtonBase, Typography } from '@mui/material';
import Link from 'next/link';
import { useMemo } from 'react';

const Subtotal = ({ products }: IProps) => {
    const { cartData } = useAppSelector((state) => state.cart);

    const subtotal = useMemo(() => {
        return products.reduce((prev, current) => {
            return (
                prev +
                (cartData[current.id]
                    ? current.price * cartData[current.id].cartQuantity
                    : 0)
            );
        }, 0);
    }, [products, cartData]);

    return (
        <Box className="flex justify-between mt-12">
            <Box />

            <Box className="flex flex-col items-end">
                <Box className="flex items-end gap-4">
                    <Typography className="text-xl font-semibold">
                        Subtotal
                    </Typography>
                    <Typography className="text-lg">Rs. {subtotal}</Typography>
                </Box>

                <Box component="small" className="mt-5 mb-3">
                    Taxes & India shipping included.
                </Box>

                <Link href="/check-out">
                    <ButtonBase className="w-72 h-12 flex justify-center items-center border border-[#28282B] border-solid bg-[#28282B] text-white cursor-pointer">
                        <Typography>Check out</Typography>
                    </ButtonBase>
                </Link>
            </Box>
        </Box>
    );
};

export default Subtotal;

interface IProps {
    products: cartProduct[];
}
