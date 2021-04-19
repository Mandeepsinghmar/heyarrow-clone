import React, { useState } from 'react';
import './index.scss';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { textSpecificCampaign } from '../../../../redux/actions';

const TextSpecificContent = (props) => {
  const {
    apiResponse, getData, isSaveDraft, campaignFormData
  } = props;
  const [description, setDescription] = useState(campaignFormData && campaignFormData.content ? campaignFormData.content : '');
  const [subject, setSubject] = useState(campaignFormData && campaignFormData.subject ? campaignFormData.subject : '');
  const [destinationUrl, setDestinationUrl] = useState(campaignFormData && campaignFormData.url ? campaignFormData.url : '');
  const [showMore, setShowMore] = useState(5);
  const history = useHistory();
  const dispatch = useDispatch();

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
      dispatch(textSpecificCampaign(data));
      history.push('/admin/campaigns/new/selectRecipients');
    }
  };

  if (isSaveDraft) {
    getData(description, subject, destinationUrl);
  }

  const changeDescription = (desc) => {
    setDescription(desc);
  };

  const changeSubject = (sub) => {
    setSubject(sub);
  };

  const changeDestinationUrl = (url) => {
    setDestinationUrl(url);
  };

  const addDynamicFields = (name) => {
    const data = description;
    setDescription(`${data} ${name}`);
  };

  const showMoreDynamicFieldes = () => {
    setShowMore(apiResponse.length);
  };

  const showLessDynamicFieldes = () => {
    setShowMore(5);
  };

  const renderDynamicFields = (item, index) => {
    if (index < showMore) {
      return (
        <div className="customer_name">
          <span className="customer_text" onClick={() => { addDynamicFields(item.value); }}>{item.title}</span>
        </div>
      );
    }
    return null;
  };

  const renderShowMoreLessText = () => {
    if (showMore > 5) {
      return (
        <div onClick={() => { showLessDynamicFieldes(); }} className="show_more_less">
          show less...
        </div>
      );
    }
    return (
      <div onClick={() => { showMoreDynamicFieldes(); }} className="show_more_less">
        show more...
      </div>
    );
  };

  return (
    <>
      <div className="text_container">
        <span className="text_subtitle">Text body</span>
        <hr className="text_seperator" />

        <div className="text_dynamic_fields">
          <div className="text_content">
            <label htmlFor="contentLabel" className="text_input_label">
              <textarea
                placeholder="YourContent"
                className="text_input_text"
                value={description}
                type="text"
                id="descriptionText"
                onChange={(e) => { changeDescription(e.target.value); }}
              />
            </label>
          </div>

          <div className="dynamic_fields_group">
            <span className="dynamic_field_title">Add dynamic fields:</span>
            <div className="dynamic_group_data">
              <div className="dynamic_group">
                {
                  apiResponse && apiResponse.map((item, index) => (
                    renderDynamicFields(item, index)
                  ))
                }
              </div>
            </div>
            {apiResponse.length > 5 ? renderShowMoreLessText() : null}

          </div>
        </div>

        <div className="text_subject">
          <span className="text_subject_text">Subject line to display</span>
        </div>
        <form>
          <label htmlFor="reLabel" className="text_subject_input">
            <input
              placeholder="Re:"
              value={subject}
              className="text_subject_list_input"
              type="text"
              id="subjecttext"
              onChange={(e) => { changeSubject(e.target.value); }}
            />
          </label>
        </form>

        <div className="destination_list">
          <div className="text_destination_frame">
            <span className="destinatio_text">Include a destination URL</span>
          </div>
        </div>
        <form>
          <label htmlFor="httpLabel" className="text_destination_input">
            <input
              placeholder="http://"
              value={destinationUrl}
              className="text_destination_list_input"
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

TextSpecificContent.propTypes = {
  apiResponse: PropTypes.arrayOf(PropTypes.object),
  getData: PropTypes.func,
  isSaveDraft: PropTypes.bool,
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

TextSpecificContent.defaultProps = {
  apiResponse: [],
  getData: () => { },
  isSaveDraft: false,
  campaignFormData: {},
};
export default TextSpecificContent;
