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

    this.loadConfig();
  }

  loadConfig() {
    var self = this;
    var endpoints = {};
    endpoints['sharePointUri'] = 'https://blackmarble.sharepoint.com';
    var redirectUrl = window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port !== '80' && window.location.port !== '443' ? (':' + window.location.port) : '');
    self.authContext = new AuthenticationContext({
      instance: 'https://login.microsoftonline.com/',
      tenant: 'blackmarble.com',
      clientId: 'b81be089-6745-4323-9411-dd29ae689d45',
      postLogoutRedirectUri: redirectUrl,
      redirectUri: redirectUrl,
      extraQueryParameter: 'nux=1',
      endpoints: endpoints
    });

    var isCallback = self.authContext.isCallback(window.location.hash);
    if (isCallback) {
      self.authContext.handleWindowCallback();
    }

    var user = self.authContext.getCachedUser();
    if (user) {
      self.authContext.acquireToken('https://blackmarble.sharepoint.com', function (errordetails, result, error) {
        self.state.serviceToken = result;
      });
    }
    else {
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


