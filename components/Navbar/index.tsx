import env from '@/utils/env';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Skeleton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, MouseEvent, useState } from 'react';

const Navbar = () => {
    const { status, data: session } = useSession();
    const { push } = useRouter();

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    // const [openSideBar, setOpenSideBar] = useState(false);

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>): void => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = (): void => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="fixed">
            <Container
                sx={{
                    maxWidth: '100% !important',
                    userSelect: 'none',
                }}
            >
                <Toolbar disableGutters>
                    <Link href="/">
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: {
                                    xs: 'none',
                                    md: 'flex',
                                },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {env.appName}
                        </Typography>
                    </Link>

                    <Box
                        sx={{
                            mr: 2,
                            display: {
                                xs: 'flex',
                                md: 'none',
                            },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link href="/">
                            <Typography
                                variant="h5"
                                noWrap
                                component="p"
                                sx={{
                                    cursor: 'pointer',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {env.appName}
                            </Typography>
                        </Link>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: {
                                xs: 'none',
                                md: 'flex',
                            },
                        }}
                    />

                    {status === 'loading' ? (
                        <Skeleton
                            variant="text"
                            sx={{
                                fontSize: '24px',
                                width: '200px',
                            }}
                        />
                    ) : (
                        <Fragment>
                            <Box
                                sx={{
                                    marginRight: 3.5,
                                }}
                            >
                                <Link href="/cart">
                                    <Badge
                                        badgeContent={0}
                                        className="cart-badge"
                                    >
                                        <ShoppingCartIcon
                                            sx={{
                                                color: '#ffffff',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Badge>
                                </Link>
                            </Box>

                            <Box
                                sx={{
                                    flexGrow: 0,
                                    display: 'flex',
                                    gap: '1rem',
                                    ...(status === 'authenticated' && {
                                        display: 'none',
                                    }),
                                }}
                            >
                                <Typography>
                                    <Link href="/auth/signin">Sign In</Link>
                                </Typography>

                                <Typography>
                                    <Link href="/auth/signup">Sign Up</Link>
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    flexGrow: 0,
                                }}
                            >
                                {['unauthenticated', 'loading'].includes(
                                    status
                                ) || !session ? null : (
                                    <Tooltip title="Open settings">
                                        <IconButton
                                            onClick={handleOpenUserMenu}
                                            sx={{
                                                p: 0,
                                            }}
                                        >
                                            <Avatar
                                                alt={session.user.name}
                                                src={
                                                    session.user
                                                        .profilePicture ?? ''
                                                }
                                            />
                                        </IconButton>
                                    </Tooltip>
                                )}

                                <Menu
                                    sx={{
                                        mt: '45px',
                                    }}
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            push('/profile');
                                            handleCloseUserMenu();
                                        }}
                                    >
                                        <Typography textAlign="center">
                                            Profile
                                        </Typography>
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => {
                                            signOut();
                                        }}
                                    >
                                        <Typography textAlign="center">
                                            Sign Out
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Fragment>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
