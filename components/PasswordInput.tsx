import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput, {
    type OutlinedInputProps,
} from '@mui/material/OutlinedInput';
import React from 'react';

type PropsType = OutlinedInputProps & {
    inputerror: {
        touched?: boolean;
        helperText?: string;
    };
};

const PasswordInput = (props: PropsType): JSX.Element => {
    const {
        inputerror: { touched, helperText },
        fullWidth,
        margin,
        label,
    } = props;

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = (): void => {
        setShowPassword((show) => !show);
    };

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ): void => {
        event.preventDefault();
    };

    return (
        <FormControl
            variant="outlined"
            fullWidth={fullWidth ?? true}
            margin={margin ?? 'dense'}
            error={touched === true && Boolean(helperText)}
        >
            <InputLabel htmlFor="outlined-adornment-password">
                {label}
            </InputLabel>

            <OutlinedInput
                id="outlined-adornment-password"
                aria-describedby="outlined-weight-helper-text"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
                {...props}
            />

            {Boolean(helperText) && touched ? (
                <FormHelperText
                    id="outlined-weight-helper-text"
                    error={Boolean(helperText)}
                >
                    {helperText}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
};

export default PasswordInput;
