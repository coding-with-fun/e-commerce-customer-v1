import Modal from '@/HOC/Modal';
import toast from '@/libs/toast';
import { productDetailsResponse } from '@/pages/api/product/details/[id]';
import env from '@/utils/env';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveIcon from '@mui/icons-material/Remove';
import ShareIcon from '@mui/icons-material/Share';
import { Box, ButtonBase, InputBase, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, Fragment, useState } from 'react';

const Details = ({ product }: IProps) => {
    const { asPath } = useRouter();

    const [itemsToAddInCart, setItemsToAddInCart] = useState(1);
    const [isShareLinkAlertOpen, setIsShareLinkAlertOpen] = useState(false);
    const [cleanShareLinkAlertContent, setCleanShareLinkAlertContent] =
        useState(false);

    const handleCloseShareLinkAlert = () => {
        setIsShareLinkAlertOpen(false);
    };

    const handleOpenShareLinkAlert = () => {
        setIsShareLinkAlertOpen(true);
    };

    const handleChangeItemsInCart = (e: ChangeEvent<HTMLInputElement>) => {
        let value: number | string = e.target.value;

        if (!isNaN(+value)) {
            value = +value;
            setItemsToAddInCart(value);
        }
    };

    const handleAddMoreToCart = () => {
        if (product.quantity > itemsToAddInCart) {
            setItemsToAddInCart((prev) => prev + 1);
        }
    };

    const handleRemoveFromCart = () => {
        if (itemsToAddInCart > 1) {
            setItemsToAddInCart((prev) => prev - 1);
        }
    };

    return (
        <Fragment>
            <Box className="flex flex-col gap-8 py-16 md:flex-row md:justify-center">
                <Box className="relative max-w-[470px] w-full mx-auto md:mx-0 md:flex-1 h-[250px] md:h-auto sm:h-[320px]">
                    <Image
                        priority
                        fill
                        quality={100}
                        src={product.coverImage}
                        alt={product.title}
                        sizes="160px"
                        style={{
                            objectFit: 'contain',
                        }}
                    />
                </Box>

                <Box className="md:w-1/2">
                    <Typography className="text-sm">
                        {product.seller?.name}
                    </Typography>

                    <Typography
                        component="h1"
                        variant="h4"
                        className="product-title font-medium mb-6"
                    >
                        {product.title}
                    </Typography>

                    <Box>
                        <Typography className="text-lg">
                            Rs. {product.price}
                        </Typography>
                    </Box>

                    <Typography className="text-xs">
                        Taxes & India shipping included.
                    </Typography>

                    <Box className="mt-3">
                        <Typography className="text-xs mb-1">
                            Quantity
                        </Typography>

                        <Box className="flex items-center border border-black border-solid w-fit">
                            <ButtonBase
                                className="w-11 h-11 flex cursor-pointer"
                                onClick={() => {
                                    handleRemoveFromCart();
                                }}
                            >
                                <RemoveIcon className="m-auto pointer-events-none w-4" />
                            </ButtonBase>

                            <InputBase
                                value={itemsToAddInCart}
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
                    </Box>

                    <Box className="max-w-[30rem] my-10">
                        <ButtonBase className="w-full h-12 flex justify-center items-center border border-black border-solid mb-4 cursor-pointer">
                            <Typography>Add to cart</Typography>
                        </ButtonBase>

                        <ButtonBase className="w-full h-12 flex justify-center items-center border border-black border-solid bg-black text-white cursor-pointer">
                            <Typography>Buy it now</Typography>
                        </ButtonBase>
                    </Box>

                    <Typography className="text-gray-600 font-light text-sm">
                        Item ships in 1-2 business days from our warehouse. Free
                        shipping all over India, delivers within 7-10 business
                        days.
                    </Typography>

                    <Box
                        className="flex items-center justify-start gap-2 mt-2 cursor-pointer w-fit hover:underline"
                        onClick={handleOpenShareLinkAlert}
                    >
                        <ShareIcon className="text-sm" />

                        <Typography className="text-sm">Share</Typography>
                    </Box>
                </Box>
            </Box>

            <Modal
                handleCloseModal={handleCloseShareLinkAlert}
                open={isShareLinkAlertOpen}
                setCleanModalContent={setCleanShareLinkAlertContent}
            >
                {cleanShareLinkAlertContent ? null : (
                    <ShareLinkAlert url={env.baseURL + asPath} />
                )}
            </Modal>
        </Fragment>
    );
};

export default Details;

interface IProps {
    product: productDetailsResponse;
}

const ShareLinkAlert = ({ url }: { url: string }) => {
    return (
        <Box>
            <Typography className="text-lg mb-5">Share</Typography>

            <Box className="flex items-center bg-[#f9f9f9] border border-solid border-[rgba(0, 0, 0, 0.1)] rounded-lg pl-4">
                <InputBase
                    value={url}
                    fullWidth
                    inputProps={{
                        className: 'share-link text-sm',
                    }}
                />

                <ButtonBase
                    className="cursor-pointer py-2 p-4"
                    onClick={() => {
                        navigator.clipboard.writeText(url);
                        toast('Link copied to clipboard', 'success');
                    }}
                >
                    <ContentCopyIcon />
                </ButtonBase>
            </Box>
        </Box>
    );
};
