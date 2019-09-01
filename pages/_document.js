import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
        <Head>
          {this.props.styleTags}
          <style>
            {`#__next {
              height: 100%;
              width: 100%;
              overflow: hidden;
            }`}
          </style>
        </Head>
        <body style={{ margin: 0, height: '100%', width: '100%' }}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
