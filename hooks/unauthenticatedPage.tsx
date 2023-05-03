import { PageLoader } from '@/HOC/AppWrapper';
import { NextComponentType, NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const unauthenticatedPage = (
    Component: NextComponentType<NextPageContext, any, {}>
) => {
    const AuthenticatedComponent = (props: any) => {
        const { status } = useSession();
        const { push } = useRouter();

        if (status === 'loading') {
            return <PageLoader />;
        }

        if (status === 'authenticated') {
            push('/');
            return;
        }

        return <Component {...props} />;
    };

    if (Component.getInitialProps) {
        AuthenticatedComponent.getInitialProps = Component.getInitialProps;
    }

    return AuthenticatedComponent;
};

export default unauthenticatedPage;
