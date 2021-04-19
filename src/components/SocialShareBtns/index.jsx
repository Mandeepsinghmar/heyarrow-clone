import React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import PropTypes from 'prop-types';

import './index.scss';
import CustomIcon from '../common/CustomIcon';

const SocialShareBtns = ({
  url
}) => (
  <div className="socialList">
    <ul>
      <li>
        <TwitterShareButton url={url}>
          <div className="socialIcon twitter">
            <CustomIcon icon="Twitter" />
          </div>
        </TwitterShareButton>
        Twitter
      </li>
      <li>
        <FacebookShareButton url={url}>
          <div className="socialIcon facebook">
            <CustomIcon icon="Facebook" />
          </div>
        </FacebookShareButton>
        Facebook
      </li>
      <li>
        <LinkedinShareButton url={url}>
          <div className="socialIcon linkedin">
            <CustomIcon icon="Linkdin" />
          </div>
        </LinkedinShareButton>
        Linkedin
      </li>
      <li>
        <WhatsappShareButton url={url}>
          <div className="socialIcon whatsapp">
            <CustomIcon icon="Whatsapp" />
          </div>
        </WhatsappShareButton>
        WhatsApp
      </li>
    </ul>
  </div>
);

SocialShareBtns.propTypes = {
  url: PropTypes.string,
};

SocialShareBtns.defaultProps = {
  url: '',
};

export default SocialShareBtns;
