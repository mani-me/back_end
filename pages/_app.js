import React from 'react';
import App, { Container } from 'next/app';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import Auth from '../components/Auth';
import { configureAmplify } from '../components/Aws';
import Layout from '../components/Layout';

function createMiddlewares({ isServer }) {
  let middlewares = [thunkMiddleware];
  middlewares.push(
    createLogger({
      level: 'info',
      collapsed: true
    })
  );

  return middlewares;
}

const initStore = (initialState = {}, context) => {
  let { isServer } = context;
  let middlewares = createMiddlewares({ isServer });
  return createStore(rootReducer, initialState, compose(applyMiddleware(...middlewares)));
};

class _App extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.state = {
      isAuth: false
    };
  }

  componentDidMount() {
    configureAmplify();
    this.authSubscriber = this.props.store.subscribe(this.isAuthSubscriber);
  }

  componentWillUnmount() {
    this.authSubscriber();
  }

  isAuthSubscriber = () => {
    const reduxState = this.props.store.getState();
    const isAuth = reduxState.userData.isAuth;
    this.setState({ isAuth });
  };

  render() {
    const { Component, pageProps, store } = this.props;
    const { isAuth } = this.state;
    return (
      <Container>
        <Provider store={store}>
          { isAuth ?
            <Layout before={false}>
              <Component {...pageProps} />
            </Layout>
            :
            <Auth />
          }
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore)(_App);
