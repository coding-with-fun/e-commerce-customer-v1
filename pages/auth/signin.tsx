import PasswordInput from '@/components/PasswordInput';
import unauthenticatedPage from '@/hooks/unauthenticatedPage';
import toast from '@/libs/toast';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { SignInResponse, signIn } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const SignIn = () => {
    const {
        query: { callbackUrl },
        push,
    } = useRouter();

    const [isDataSubmitting, setIsDataSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit: async (values) => {
            setIsDataSubmitting(true);
            const response = (await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false,
            })) as SignInResponse;

            if (!response.ok) {
                toast(response.error || 'Something went wrong.');
                setIsDataSubmitting(false);
            }
        },
    });

    return (
        <Fragment>
            <Head>
                <title>Sign In</title>
            </Head>

            <Box className="h-full flex flex-col items-center">
                <Typography component="h1" variant="h4" className="mt-12 mb-6">
                    Sign In
                </Typography>

                <Box
                    component="form"
                    noValidate
                    className="px-6 w-full max-w-sm"
                    onSubmit={formik.handleSubmit}
                >
                    <TextField
                        fullWidth
                        autoFocus
                        id="email"
                        label="Email"
                        variant="outlined"
                        margin="dense"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.email === true &&
                            Boolean(formik.errors.email)
                        }
                        helperText={
                            formik.touched.email === true && formik.errors.email
                        }
                        disabled={isDataSubmitting}
                    />

                    <PasswordInput
                        fullWidth
                        id="password"
                        label="Password"
                        margin="dense"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        inputerror={{
                            touched: formik.touched.password,
                            helperText: formik.errors.password,
                        }}
                        disabled={isDataSubmitting}
                    />

                    {isDataSubmitting ? (
                        <Box className="flex flex-1 justify-center mt-6 mb-4">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            type="submit"
                            className="mt-6 mb-4"
                            disabled={isDataSubmitting}
                        >
                            Sign In
                        </Button>
                    )}
                </Box>
            </Box>
        </Fragment>
    );
};

export default unauthenticatedPage(SignIn);

const schema = z.object({
    email: z
        .string({
            invalid_type_error: 'Email is required.',
            required_error: 'Email is required.',
        })
        .nonempty('Email is required.')
        .email('Please enter a valid email address.'),
    password: z
        .string({
            required_error: 'Password is required.',
            invalid_type_error: 'Password is required.',
        })
        .nonempty('Password is required.'),
});

export type SignInFormSchemaType = z.infer<typeof schema>;
