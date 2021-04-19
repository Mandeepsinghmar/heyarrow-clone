import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import InnerHTML from 'dangerously-set-html-content';

const PreviewComponent = (props) => {
  const { campaignFormData } = props;
  const [iframeData, setIFrameData] = useState('');
  const history = useHistory();

  const previewApiCall = () => {
    if (campaignFormData) {
      const config = {
        method: 'get',
        url: `https://graph.facebook.com/v9.0/act_1174824309641420/generatepreviews?ad_format=DESKTOP_FEED_STANDARD&access_token=EAADWqUZAaGDwBAGJTaK8YRwKnvEjvwEFZCq8DZCHaV6tNML1ceZBMMgsZBm2l5rn95Ak9EDRpKJEFZCzwAGZAxj0MIEUprjSd3x3TPL5K7DJuLcLqjIYeejdCtK7l7ZCWDelHZChhZCQYvo4bpOJwT2KjoNMNXPieakontcGkdL59QoPMpFZAgqIjpOAxckA5tJUHEZD&creative={"object_story_spec":{"link_data":{"call_to_action":{"type":"USE_APP","value":{"link":"https://arrow-bravo-team-dev-env.uc.r.appspot.com/"}},"description":${JSON.stringify(campaignFormData.content)},"link":"https://arrow-bravo-team-dev-env.uc.r.appspot.com/","message":${JSON.stringify(campaignFormData.subject)},"name": ${JSON.stringify(campaignFormData.campaignName)},"picture": ${JSON.stringify(campaignFormData.fileUpload.fileUrl)}},"page_id": "176359220592848"}}`,
        headers: {}
      };

      axios(config)
        .then((response) => {
          setIFrameData(JSON.stringify(response.data.data[0].body));
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  useEffect(() => {
    previewApiCall();
  }, []);

  const onClickNext = () => {
    history.push('/admin/campaigns/new/scheduleCampaign');
  };
  const htmlPart = iframeData && JSON.parse(iframeData);
  return (
    <div>
      <InnerHTML html={htmlPart} className="i_frame" />
      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Next</span>
        </Button>
      </div>
    </div>
  );
};

PreviewComponent.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

PreviewComponent.defaultProps = {
  campaignFormData: {},
};

export default PreviewComponent;
