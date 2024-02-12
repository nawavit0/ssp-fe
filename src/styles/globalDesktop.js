import { createGlobalStyle } from 'styled-components';

const GlobalDesktopStyle = createGlobalStyle`
  .pre-render {
    .homepage-banner {
      .flickity-viewport {
        min-height: 435px !important;
      }
    }
  }
`;

export default GlobalDesktopStyle;
