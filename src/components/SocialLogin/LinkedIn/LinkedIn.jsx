import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import '../assets/index.css';

const getPopupPositionProperties = ({
  width = 600,
  height = 600,
}) => {
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);
  return `left=${left},top=${top},width=${width},height=${height}`;
};

export class LinkedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: props.clientId,
      scope: props.scope,
      supportIE: props.supportIE,
      redirectPath: props.redirectPath
    };
    this.handleLinkedIn = this.handleLinkedIn.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage, false);
    if (this.popup && !this.popup.closed) this.popup.close();
  }

  handleLinkedIn(e) {
    if (e) {
      e.preventDefault();
    }
    const { redirectUri } = this.props;
    const { clientId } = this.state;
    const { scope } = this.state;
    const { supportIE } = this.state;
    const { redirectPath } = this.state;
    const scopeParam = `&scope=${supportIE ? scope : encodeURI(scope)}`;
    let linkedInAuthenLink = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}${scopeParam}&state=fdsf78fyds7fm`;
    if (supportIE) {
      linkedInAuthenLink = `${window.location.origin}${redirectPath}?linkedin_redirect_url=${encodeURIComponent(linkedInAuthenLink)}`;
    }
    this.popup = window.open(linkedInAuthenLink, '_blank', getPopupPositionProperties({ width: 600, height: 600 }));
    window.removeEventListener('message', this.receiveMessage, false);
    window.addEventListener('message', this.receiveMessage, false);
  }

  receiveMessage(event) {
    const { state } = this.state;
    const { onFailure, onSuccess } = this.props;
    if (event.origin === window.location.origin) {
      if (event.data.errorMessage && event.data.from === 'Linked In') {
        // Prevent CSRF attack by testing state
        if (event.data.state !== state) {
          this.popup.close();
        }
        onFailure(event.data);
        return this.popup && this.popup.close();
      } if (event.data.code && event.data.from === 'Linked In') {
        // Prevent CSRF attack by testing state
        if (event.data.state !== state) {
          this.popup.close();
        }
        onSuccess({ code: event.data.code });
        return this.popup && this.popup.close();
      }
    }
    return null;
  }

  render() {
    const {
      className, disabled, children, renderElement
    } = this.props;
    if (renderElement) {
      return renderElement({
        onClick: this.handleLinkedIn, disabled
      });
    }
    return (
      <button
        type="button"
        onClick={this.handleLinkedIn}
        className={className}
        disabled={disabled}
      >
        {children}
      </button>

    );
  }
}
LinkedIn.propTypes = {
  className: PropTypes.string,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  // onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  clientId: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  // state: PropTypes.string,
  scope: PropTypes.string,
  renderElement: PropTypes.func.isRequired,
  supportIE: PropTypes.bool,
  redirectPath: PropTypes.string,
  children: PropTypes.element
};
LinkedIn.defaultProps = {
  className: 'btn-linkedin',
  disabled: false,
  children: (<img src="../../../assets/Icons/Header/Icon/LinkedIn.svg" alt="Log in with Linked In" style={{ maxWidth: '180px' }} />),
  // state: 'fdsf78fyds7fm',
  supportIE: false,
  redirectPath: '/linkedin',
  scope: 'r_emailaddress',
};
export default LinkedIn;
