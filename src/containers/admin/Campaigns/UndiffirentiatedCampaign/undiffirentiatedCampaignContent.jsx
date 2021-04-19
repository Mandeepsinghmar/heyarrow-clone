import React, { useState } from 'react';
import './index.scss';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { undiffirentiatedCampaign } from '../../../../redux/actions';

const UndiffirentiatedCampaignContent = (props) => {
  const {
    getData, isSaveDraft, campaignFormData
  } = props;
  const [description, setDescription] = useState(campaignFormData && campaignFormData.content ? campaignFormData.content : '');
  const [subject, setSubject] = useState(campaignFormData && campaignFormData.subject ? campaignFormData.subject : '');
  const [destinationUrl, setDestinationUrl] = useState(campaignFormData && campaignFormData.url ? campaignFormData.url : '');
  const history = useHistory();
  const dispatch = useDispatch();

  if (isSaveDraft) {
    getData(description, subject, destinationUrl);
  }

  const onClickNext = () => {
    if (!description) {
      toast.error('Please enter description');
    } else if (!subject) {
      toast.error('Please enter subject');
    } else if (!destinationUrl) {
      toast.error('Please enter destinationUrl');
    } else {
      const data = {
        content: description,
        subject,
        url: destinationUrl
      };
      dispatch(undiffirentiatedCampaign(data));
      history.push('/admin/campaigns/new/campaignUpload');
    }
  };

  const changeDescription = (desc) => {
    setDescription(desc);
  };

  const changeSubject = (sub) => {
    setSubject(sub);
  };

  const changeDestinationUrl = (url) => {
    setDestinationUrl(url);
  };

  return (
    <>
      <div className="undifferentiate_container">
        <span className="undifferentiate_subtitle">Add main copy or description</span>
        <hr className="seperator" />
        <div className="undifferentiate_text_dynamic_fields">
          <div className="undifferentiate_text_content">
            <label htmlFor="contentLabel" className="undifferentiate_input_label">
              <textarea
                placeholder="YourContent"
                className="undifferentiate_input_text"
                value={description}
                type="text"
                id="descriptionText"
                onChange={(e) => { changeDescription(e.target.value); }}
              />
            </label>
          </div>
        </div>

        <div className="undifferentiate_subject">
          <span className="undifferentiate_subject_text">Subject line to display</span>
        </div>
        <form>
          <label htmlFor="reLabel" className="undifferentiate_subject_input">
            <input
              placeholder="Re:"
              value={subject}
              className="undifferentiate_subject_list_input"
              type="text"
              id="subjecttext"
              onChange={(e) => { changeSubject(e.target.value); }}
            />
          </label>
        </form>

        <div className="destination_list">
          <div className="destination_frame">
            <span className="destination_undifferentiate">Include a destination URL</span>
          </div>
        </div>
        <form>
          <label htmlFor="httpLabel" className="undifferentiate_destination_input">
            <input
              placeholder="http://"
              value={destinationUrl}
              className="undifferentiate_destination_list_input"
              type="text"
              id="destinationUrl"
              onChange={(e) => { changeDestinationUrl(e.target.value); }}
            />
          </label>
        </form>

      </div>

      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Next</span>
        </Button>
      </div>

    </>
  );
};

UndiffirentiatedCampaignContent.propTypes = {
  getData: PropTypes.func,
  isSaveDraft: PropTypes.bool,
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

UndiffirentiatedCampaignContent.defaultProps = {
  getData: () => { },
  isSaveDraft: false,
  campaignFormData: {},
};

export default UndiffirentiatedCampaignContent;
