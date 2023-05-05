import WarningIcon from '@/public/assets/icons/warning.png';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useRouter } from 'next/router';

const SignInAlert = () => {
    const { push } = useRouter();

    const handleSignIn = () => {
        push(`/auth/signin`);
    };

    return (
        <Box className="flex flex-col items-center gap-4">
            <Image src={WarningIcon} alt="Warning" width={70} height={70} />

            <Box className="flex flex-col text-center gap-2">
                <Typography className="font-semibold">
                    You are currently not signed in.
                </Typography>
                <Typography>
                    To favorite a product, you need to sign in first.
                </Typography>
            </Box>

            <Button variant="outlined" onClick={handleSignIn}>
                Sign In
            </Button>
        </Box>
    );
};

export default SignInAlert;
