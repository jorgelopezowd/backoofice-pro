import { Redirect, Route } from 'umi';
import React from 'react';
import QueueAnim from 'rc-queue-anim';
import Authorized from './Authorized';

const AuthorizedRoute = ({ component: Component, render, authority, redirectPath, ...rest }) => (
  <Authorized
    authority={authority}
    noMatch={
      <Route
        {...rest}
        render={() => (
          <Redirect
            to={{
              pathname: redirectPath,
            }}
          />
        )}
      />
    }
  >
    <QueueAnim type={['right', 'left']}>
      <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
    </QueueAnim>
  </Authorized>
);

export default AuthorizedRoute;
