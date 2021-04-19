import React, { Component } from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line import/no-extraneous-dependencies
import openPopup from './popup';

function getQueryVariable(context, variable) {
  const query = context.location.search.substring(1);
  const vars = query.split('&');
  const code = vars
    .map((i) => {
      const pair = i.split('=');
      if (pair[0] === variable) {
        return pair[1];
      }

      return null;
    })
    .filter((d) => {
      if (d) {
        return true;
      }

      return false;
    });

  return code[0];
}

class InstagramLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
    this.onBtnClick = this.onBtnClick.bind(this);
  }

  componentDidMount() {
    this.checkInstagramAuthentication(window);
  }

  onBtnClick() {
    const { clientId, redirectUri, useRedirect } = this.props; // scope
    const redirectLoginUri = redirectUri || window.location.href;
    // const responseType = this.props.implicitAuth ? 'token' : 'code';
    // const url = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=instagram_graph_user_profile`
    const url = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectLoginUri}&scope=user_profile,user_media&response_type=code`;
    if (useRedirect) {
      window.location.href = url;
    } else {
      this.oAuthSignIn({ url });
    }
  }

  // eslint-disable-next-line consistent-return
  onCredentialsChanged(popup, resolve, reject) {
    const { onFailure } = this.props;
    if (!resolve) {
      return new Promise(
        (res, rej) => { this.onCredentialsChanged(popup, res, rej); }
      );
    }
    let isFinished;
    try {
      isFinished = this.checkInstagramAuthentication(popup);
    } catch (err) {
      // An exception is thrown when we try to access to another website's url
    }

    if (isFinished) {
      popup.close();
    } else if (popup.closed) {
      onFailure({
        error: 'closed',
        error_reason: 'oauth_canceled',
        error_description: 'User canceled the authentication'
      });
    } else {
      setTimeout(() => this.onCredentialsChanged(popup, resolve, reject), 0);
    }
  }

  oAuthSignIn({ url, tab = false }) {
    const name = tab ? '_blank' : 'instagram';
    const { width, height } = this.props;
    const popup = openPopup({
      url, name, width, height
    });
    this.onCredentialsChanged(popup);
  }

  checkInstagramAuthentication(context) {
    const { onFailure, implicitAuth, onSuccess } = this.props;
    if (implicitAuth) {
      const matches = context.location.hash.match(/=(.*)/);
      if (matches) {
        onSuccess(matches[1]);

        return true;
      }
    } else if (context.location.search.includes('code')) {
      onSuccess(getQueryVariable(context, 'code'));

      return true;
    } else if (context.location.search.includes('error')) {
      onFailure({
        error: getQueryVariable(context, 'error'),
        error_reason: getQueryVariable(context, 'error_reason'),
        error_description: getQueryVariable(context, 'error_description')
      });

      return true;
    }

    return false;
  }

  render() {
    const style = {
      display: 'block',
      border: 0,
      borderRadius: 20,
      boxShadow: 'rgba(0, 0, 0, 0.5) 0 1px 2px',
      color: '#ffffff',
      cursor: 'pointer',
      fontSize: '19px',
      overflow: 'hidden',
      padding: '10px',
      userSelect: 'none',
      backgroundImage: 'url("https://via.placeholder.com/500")',
      background: 'linear-gradient(to right, rgb(236, 146, 35) 0%, rgb(177, 42, 160) 50%, rgb(105, 14, 224) 100%)',
      hover: {
        background: 'linear-gradient(to right, rgb(214, 146, 60) 0%, rgb(160, 11, 143) 50%, rgb(56, 10, 115) 100%)'
      }
    };
    const { hover } = this.state;
    const {
      cssClass, buttonText, children, tag, type, render
    } = this.props;
    if (render) {
      return render({ onClick: this.onBtnClick });
    }
    const instagramLoginButton = React.createElement(
      tag,
      {
        className: cssClass,
        onClick: this.onBtnClick,
        onMouseEnter: () => {
          this.setState({ hover: true });
        },
        onMouseLeave: () => {
          this.setState({ hover: false });
        },
        style: cssClass ? {} : { ...style, ...(hover ? style.hover : null) },
        type
      },
      children || buttonText
    );

    return instagramLoginButton;
  }
}
InstagramLogin.defaultProps = {
  buttonText: 'Login with Instagram',
  // scope: 'instagram_graph_user_media',
  tag: 'button',
  type: 'button',
  implicitAuth: false,
  useRedirect: false,
  width: 400,
  height: 800,
  cssClass: PropTypes.string,
  children: PropTypes.node,
  render: PropTypes.func,
  redirectUri: PropTypes.string,
};

InstagramLogin.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  // scope: PropTypes.string,
  cssClass: PropTypes.string,
  children: PropTypes.node,
  tag: PropTypes.string,
  redirectUri: PropTypes.string,
  type: PropTypes.string,
  implicitAuth: PropTypes.bool,
  useRedirect: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  render: PropTypes.func
};

export default InstagramLogin;
