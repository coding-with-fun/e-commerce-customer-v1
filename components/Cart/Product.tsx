import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import toast from '@/libs/toast';
import { cartProduct } from '@/pages/api/cart/get-products';
import { setProductToCart } from '@/redux/slice/cart.slice';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Box,
    ButtonBase,
    InputBase,
    Skeleton,
    Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

const Product = ({ product }: IProps) => {
    const { cartData } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();
    const { push } = useRouter();

    const productSlug = product.title.split(' ').join('-') + `-${product.id}`;

    const [isImageLoading, setIsImageLoading] = useState(true);

    const [quantity, setQuantity] = useState(cartData[product.id]);
    const changeInQuantity = useRef(false);

    const handleChangeItemsInCart = (e: ChangeEvent<HTMLInputElement>) => {
        let value: number | string = e.target.value;

        if (!isNaN(+value)) {
            value = +value;
            changeInQuantity.current = true;
            setQuantity(value);
        }
    };

    const handleAddMoreToCart = () => {
        changeInQuantity.current = true;
        setQuantity((prev) => prev + 1);
    };

    const handleRemoveFromCart = () => {
        if (quantity > 0) {
            changeInQuantity.current = true;
            setQuantity((prev) => prev - 1);
        }
    };

    const handleProductToCart = (alteredQuantity = quantity) => {
        if (alteredQuantity > product.quantity) {
            toast(
                `The vendor has only ${product.quantity} of the quantity available.`
            );
            setQuantity(product.quantity);
        } else {
            dispatch(
                setProductToCart({
                    productID: product.id,
                    productQuantity: alteredQuantity,
                })
            );
        }
    };

    useEffect(() => {
        const loadImage = setTimeout(() => {
            setIsImageLoading(false);
        }, 2000);

        return () => clearTimeout(loadImage);
    }, []);

    useEffect(() => {
        const changeQuantityTimeout = setTimeout(() => {
            if (changeInQuantity.current) {
                handleProductToCart();
            }
        }, 1000);

        return () => clearTimeout(changeQuantityTimeout);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity]);

    return cartData[product.id] ? (
        <tr>
            <td>
                <Box
                    className="grid items-center gap-16"
                    sx={{
                        gridTemplateColumns: '10rem 1fr',
                    }}
                >
                    <Box className="relative w-[10rem] h-[10rem]">
                        <Image
                            priority
                            fill
                            src={product.coverImage || ''}
                            alt={product.title}
                            sizes="160px"
                            style={{
                                objectFit: 'contain',
                                cursor: 'pointer',
                                display: isImageLoading ? 'none' : 'block',
                            }}
                            onClick={() => {
                                push(`product/${productSlug}`);
                            }}
                        />

                        <Skeleton
                            variant="rounded"
                            width={'100%'}
                            height={'100%'}
                            sx={{
                                display: isImageLoading ? 'block' : 'none',
                                marginX: 'auto',
                            }}
                        />
                    </Box>

                    <Box className="pr-16 max-w-[300px]">
                        <Typography className="text-xs">
                            {product.seller?.name}
                        </Typography>

                        <Link
                            href={`/product/${productSlug}`}
                            className="hover:underline"
                        >
                            <Typography className="product-title font-semibold mt-1 mb-2">
                                {product.title}
                            </Typography>
                        </Link>

                        <Typography className="text-sm">
                            Rs. {product.price}
                        </Typography>
                    </Box>
                </Box>
            </td>

            <td className="w-[250px]">
                <Box className="flex items-center">
                    <Box className="flex items-center border border-[#28282B] border-solid w-fit">
                        <ButtonBase
                            className="w-11 h-11 flex cursor-pointer"
                            onClick={() => {
                                handleRemoveFromCart();
                            }}
                        >
                            <RemoveIcon className="m-auto pointer-events-none w-4" />
                        </ButtonBase>

                        <InputBase
                            value={quantity}
                            onChange={handleChangeItemsInCart}
                            className="w-12 h-11"
                            inputProps={{
                                className: 'text-center h-full w-full p-0',
                            }}
                        />

                        <ButtonBase
                            className="w-11 h-11 flex cursor-pointer"
                            onClick={() => {
                                handleAddMoreToCart();
                            }}
                        >
                            <AddIcon className="m-auto pointer-events-none w-4" />
                        </ButtonBase>
                    </Box>

                    <Box className="flex items-center justify-center ml-4 cursor-pointer">
                        <DeleteOutlineOutlinedIcon
                            onClick={() => {
                                handleProductToCart(0);
                            }}
                        />
                    </Box>
                </Box>
            </td>

            <td className="text-right w-[150px]">
                <Box>
                    <Typography>
                        Rs. {cartData[product.id] * product.price}
                    </Typography>
                </Box>
            </td>
        </tr>
    ) : null;
};

export default Product;

interface IProps {
    product: cartProduct;
}
