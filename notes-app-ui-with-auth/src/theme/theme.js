import { createMuiTheme } from '@material-ui/core';
import lightBlue from '@material-ui/core/colors/lightBlue';
import pink from '@material-ui/core/colors/pink';

const theme = createMuiTheme({
    palette: {
        primary: lightBlue,
        secondary: pink,
    },
    typography: {
        useNextVariants: true,
    },
});

export default theme;