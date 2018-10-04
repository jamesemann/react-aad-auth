import AuthenticationContext from 'adal-angular';
import React from 'react';

export class AzureADAuth extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);

    this.logout = this.logout.bind(this);

    this.login = this.login.bind(this);

    this.state = {
      serviceToken: null
    };

  }
  
  componentDidMount() {
    this.loadConfig();

  }

  loadConfig() {
    let authClientId = 'b81be089-6745-4323-9411-dd29ae689d45';
    let authTenant = 'blackmarble.com';
    let authSharepointAudience = 'https://blackmarble.sharepoint.com';
    let self = this;
    let endpoints = {};
    endpoints['sharePointUri'] = authSharepointAudience;
    let redirectUrl = window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port !== '80' && window.location.port !== '443' ? (':' + window.location.port) : '');
    self.authContext = new AuthenticationContext({
      instance: 'https://login.microsoftonline.com/',
      tenant: authTenant,
      clientId: authClientId,
      postLogoutRedirectUri: redirectUrl,
      redirectUri: redirectUrl,
      extraQueryParameter: 'nux=1',
      endpoints: endpoints
    });

    let isCallback = self.authContext.isCallback(window.location.hash);
    if (isCallback) {
      console.log('callback triggered');
      self.authContext.handleWindowCallback();
    }

    let user = self.authContext.getCachedUser();
    if (user) {
      console.log('user already exists');
      self.authContext.acquireToken(authSharepointAudience, function (errordetails, result, error) {
        self.setState( { serviceToken : result });
      });
    }
    else {
      console.log('user doesnt exist, logging in');
      self.authContext.login();
    }
  }

  login() {
    this.authContext.login();
  }

  logout() {
    this.authContext.logOut();
  }

  render() {
    return <div>{this.state ? JSON.stringify(this.state) : ''}</div>;
  }
}


