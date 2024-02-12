const theme = {
  // Logo
  // logo: '/images/logo.svg',
  // Font
  fontFamily: '"Gotham", Prompt, sans-serif',
  fontSize: '13px',
  // Responsive Breakpoint
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 769,
    lg: 1024,
    xl: 1200,
  },
  // Container
  container: {
    maxWidth: 1366,
    padding: {
      xs: '0',
      md: '0',
      lg: '0',
      xl: '0',
    },
  },
  // Button
  btnHeight: 40,
  btn: {
    primary: '#854ba2',
    danger: '#FF3333',
    warning: '#f47920',
    success: '#33AA33',
    default: '#333333',
  },
  btnHover: {
    primary: '#5f267e',
    danger: '#EE2222',
    warning: '#e36810',
    success: '#229922',
    default: 'transparent',
  },
  text: {
    primary: '#4c1e64',
    danger: '#e02b27',
    warning: '#FF9900',
    success: '#4dad18',
    default: '#000000',
  },
  color: {
    defaultSsp: '#0B233D',
    primary: '#331245',
    danger: '#e02b27',
    warning: '#FF9900',
    success: '#4ba918',
    default: '#000000',
    blackBase: '#000000',
    whiteBase: '#ffffff',
  },
  inputStyle: props => `
    font-size: 18px;
    border-radius: 0;
    height: 35px;
    border-color: #d8d8d8;
    position: relative;
    &:focus{
      background-color: rgba(135,178,199,0.09);
      border: 1px solid #87b2c7;
    }
    &:hover {
      background-color: white;
      border-color:#939598;
    }
    ${props &&
      props.error &&
      `
      border-color: #f36b7c;
      & + div {
        width: 100%;
      }
      & + div:after {
        content: ' ';
        display: inline-block;
        position: absolute;
        width:20px;
        height:20px;
        top: -30px;
        right: 11px;
        background: url(/icons/ico-error.png) no-repeat 97% center;
      }
    `}

    ${props &&
      props.success &&
      `
      border-color: green;
      & + div {
        width: 100%;
      }
      & + div:after {
        content: ' ';
        display: inline-block;
        position: absolute;
        width:20px;
        height:20px;
        top: -30px;
        right: 11px;
        background: url(/icons/check.jpg) no-repeat 97% center;
      }
    `}

    ${props && props.inputStyle}
  `,
  textAreaStyle: props => `
    font-size: 18px;
    border-radius: 0;
    height: 100px;
    border-color: #d8d8d8;
    position: relative;
    &:focus{
      background-color: rgba(135,178,199,0.09);
      border: 1px solid #87b2c7;
    }
    &:hover {
      background-color: white;
      border-color:#939598;
    }
    ${props &&
      props.error &&
      `
      border-color: #f36b7c;
      & + div {
        width: 100%;
      }
      & + div:after {
        content: ' ';
        display: inline-block;
        position: absolute;
        width:20px;
        height:20px;
        top: -30px;
        right: 11px;
        background: url(/icons/ico-error.png) no-repeat 97% center;
      }
    `}

    ${props &&
      props.success &&
      `
      border-color: green;
      & + div {
        width: 100%;
      }
      & + div:after {
        content: ' ';
        display: inline-block;
        position: absolute;
        width:20px;
        height:20px;
        top: -30px;
        right: 11px;
        background: url(/icons/check.jpg) no-repeat 97% center;
      }
    `}

    ${props && props.inputStyle}
  `,
};

export default theme;
