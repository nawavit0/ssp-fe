import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
body, html {
    margin: 0;
    font-family: ${props => props.theme.fontFamily};
    font-synthesis: none;
    direction: ltr;
    text-align: left;
    -ms-overflow-style: scrollbar;
    color: #333333;
    font-weight: normal;
    font-size: ${props => props.theme.fontSize};
    line-height: 1.375;
  }
  h1, h2, h3, h4, h5 {
    margin: 0;
  }

  iframe {
    max-width: 100%;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: ${props => props.theme.fontFamily};
    outline: none;
  }
  select {
    background: #fff;
  }

  input, button {
    -webkit-appearance: none;
  }

  strong {
    font-weight: bold;
  }

  * {
    outline: none;
    box-sizing: border-box;
  }

  hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #eaeaea;
    margin: 1em 0;
    padding: 0;
  }

  audio,
  canvas,
  iframe,
  img,
  svg,
  video {
    vertical-align: middle;
  }

  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }

  textarea {
    resize: vertical;
  }

  .flickity-page-dots .dot {
    width: 12px;
    height: 12px;
    opacity: 1;
    background: transparent;
    border: 2px solid #c3c3c3;
  }
  .flickity-page-dots .dot.is-selected {
    background-color: #c3c3c3;
  }
  @font-face {
  font-family: 'Prompt';
  src: url('/fonts/Prompt-Regular.eot');
  src: url('/fonts/Prompt-Regular.eot?#iefix') format('embedded-opentype'),
       url('/fonts/Prompt-Regular.ttf') format('truetype'),
       url('/fonts/Prompt-Regular.svg#/fonts/Prompt-Regular') format('svg'),
       url('/fonts/Prompt-Regular.woff') format('woff'),
       url('/fonts/Prompt-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  }

@font-face {
  font-family: 'Gotham';
  src: url('/fonts/Gotham-Medium.eot');
  src: url('/fonts/Gotham-Medium.eot?#iefix') format('embedded-opentype'),
    url('/fonts/Gotham-Medium.woff2') format('woff2'),
    url('/fonts/Gotham-Medium.woff') format('woff'),
    url('/fonts/Gotham-Medium.svg#Gotham-Book') format('svg');
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: 'Gotham';
  src: url('/fonts/Gotham-Book.eot');
  src: url('/fonts/Gotham-Book.eot?#iefix') format('embedded-opentype'),
    url('/fonts/Gotham-Book.woff2') format('woff2'),
    url('/fonts/Gotham-Book.woff') format('woff'),
    url('/fonts/Gotham-Book.ttf') format('truetype'),
    url('/fonts/Gotham-Book.svg#Gotham-Medium') format('svg');
  font-weight: normal;
  font-style: normal;
}
.flickity-button {
  &.previous {
    path {
      fill:none;stroke-width:80;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:10;
      transform: matrix(0.08,0,0,0.08,0,0);
    }
  }
  &.next {
    svg {
      transform: rotate(180deg);
      path {
        fill:none;stroke-width:80;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:10;
        transform: matrix(0.08,0,0,0.08,0,0);
      }
    }
  }
}
.flickity-button-icon {
  color: #424242;
}
.flickity-enabled.is-fullscreen {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: hsla(0, 0%, 0%, 0.9);
    padding-bottom: 35px;
    z-index: 10;
}

.flickity-enabled.is-fullscreen .flickity-page-dots {
    bottom: 10px;
}

/* prevent page scrolling when flickity is fullscreen */
html.is-flickity-fullscreen {
    overflow: hidden;
}

/* ---- flickity-fullscreen-button ---- */

.flickity-fullscreen-button {
    display: block;
    right: 10px;
    top: 10px;
    width: 24px;
    height: 24px;
    border-radius: 4px;
}

/* right-to-left */
.flickity-rtl .flickity-fullscreen-button {
    right: auto;
    left: 10px;
}

.flickity-fullscreen-button-exit { display: none; }

.flickity-enabled.is-fullscreen .flickity-fullscreen-button-exit { display: block; }
.flickity-enabled.is-fullscreen .flickity-fullscreen-button-view { display: none; }

.flickity-fullscreen-button .flickity-button-icon {
    position: absolute;
    width: 16px;
    height: 16px;
    left: 4px;
    top: 4px;
}

/* flickity-fade */
.flickity-enabled.is-fade .flickity-slider > * {
    pointer-events: none;
    z-index: 0;
}
.flickity-enabled.is-fade .flickity-slider > .is-selected {
    pointer-events: auto;
    z-index: 1;
}

a {
  text-decoration: none;
  cursor: pointer;
}
.nonePointerEvents .flickity-viewport {
  pointer-events: none;
}
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}
`;
export default GlobalStyle;
