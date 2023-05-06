import Modal from '@/HOC/Modal';
import toast from '@/libs/toast';
import { productDetailsResponse } from '@/pages/api/product/details/[id]';
import env from '@/utils/env';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveIcon from '@mui/icons-material/Remove';
import ShareIcon from '@mui/icons-material/Share';
import { Box, InputBase, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, Fragment, useState } from 'react';

const Details = ({ product }: IProps) => {
    const router = useRouter();

    const [itemsToAddInCart, setItemsToAddInCart] = useState('1');
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
        const value = e.target.value;
        setItemsToAddInCart(value);
    };

    return (
        <Fragment>
            <Box className="flex max-h-[70vh] gap-8">
                <Box className="relative flex-1">
                    <Image
                        priority
                        fill
                        quality={100}
                        src={product.coverImage}
                        alt={product.title}
                        sizes="160px"
                        style={{
                            objectFit: 'contain',
                            cursor: 'pointer',
                        }}
                    />
                </Box>

                <Box className="w-1/2">
                    <Typography>{product.seller?.name}</Typography>

                    <Typography className="product-title font-medium">
                        {product.title}
                    </Typography>

                    <Box>
                        <Typography>Rs. {product.price}</Typography>
                    </Box>

                    <Box>
                        <Typography>Quantity</Typography>

                        <Box className="flex items-center border border-black border-solid w-fit h-12">
                            <Box className="w-11 h-11 flex cursor-pointer">
                                <RemoveIcon className="m-auto" />
                            </Box>

                            <InputBase
                                value={itemsToAddInCart}
                                onChange={handleChangeItemsInCart}
                                className="w-8"
                                inputProps={{
                                    className: 'text-center',
                                }}
                            />

                            <Box className="w-11 h-11 flex cursor-pointer">
                                <AddIcon className="m-auto" />
                            </Box>
                        </Box>
                    </Box>

                    <Box className="max-w-[44rem] my-10">
                        <Box className="w-full h-12 flex justify-center items-center border border-black border-solid mb-4 cursor-pointer">
                            <Typography>Add to cart</Typography>
                        </Box>

                        <Box className="w-full h-12 flex justify-center items-center border border-black border-solid bg-black text-white cursor-pointer">
                            <Typography>Buy it now</Typography>
                        </Box>
                    </Box>

                    <Typography>
                        Item ships in 1-2 business days from our warehouse. Free
                        shipping all over India, delivers within 7-10 business
                        days.
                    </Typography>

                    <Box
                        className="flex items-center justify-start gap-2 mt-10 cursor-pointer w-fit hover:underline"
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
                    <ShareLinkAlert url={env.baseURL + router.asPath} />
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

            <Box className="flex gap-3 items-center bg-[#f9f9f9] border border-solid border-[rgba(0, 0, 0, 0.1)] rounded-lg py-2 px-4">
                <InputBase
                    value={url}
                    fullWidth
                    inputProps={{
                        className: 'share-link text-sm',
                    }}
                />

                <ContentCopyIcon
                    className="cursor-pointer"
                    onClick={() => {
                        navigator.clipboard.writeText(url);
                        toast('Link copied to clipboard', 'success');
                    }}
                />
            </Box>
        </Box>
    );
};
