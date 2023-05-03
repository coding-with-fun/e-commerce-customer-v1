const env = {
    appName: process.env.NEXT_PUBLIC_APP_NAME as string,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,

    auth: {
        secret: process.env.NEXT_AUTH_SECRET as string,
    },
};

export default env;
