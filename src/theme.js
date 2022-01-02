import { createTheme } from '@material-ui/core/styles'

// https://www.youtube.com/watch?v=xIIJfmDnvPE

const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(209, 90%, 30%)'
    },
    secondary: {
      main: '#FFFFFF'
    },
  },
  typography: {
    button: {
      // #https://stackoverflow.com/a/58222011
      textTransform: 'none',
      fontSize: 25,
      fontWeight: 600,
    }
  },
  // https://stackoverflow.com/a/57995968
  overrides: {
    MuiInput: {
      input: {
        color: 'white',
        fontFamily: 'Inconsolata',
        fontSize: 40,
      },
      // https://stackoverflow.com/a/56026253
      underline: {
        '&:after': {
          borderBottom: '2px solid white'
        }
      }
    },
    MuiFilledInput: {
      input: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Inconsolata',
      }
    },
    MuiFormLabel: {
      root: {
        color: 'white',
        fontFamily: 'Inconsolata',
        fontSize: 20,
        fontWeight: 600
      }
    },
    // https://mui.com/api/alert/#css
    MuiAlert: {
      root: {
        fontSize: 25,
        fontWeight: 900
      },
      icon: {
        fontSize: 35
      }
    }
  }
})

export default theme