/* eslint-disable */
import React, { useState, useEffect } from 'react';
import './index.scss';
import Checkbox from '@material-ui/core/Checkbox';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TimePicker } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { scheduleCampaign, clearAllCampaignData } from '../../../../redux/actions';
import { API_MARKETING } from '../../../../constants';

const ScheduleCampaign = (props) => {
  const { campaignFormData, getData, isSaveDraft } = props;
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(true);
  const [postCampaign, setPostCampaign] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [btnDisable, setBtnDisable] = useState(false);
  const [callbackFn, setCallBackFn] = useState(true);
  const [remindAt, setRemindAt] = React.useState(5);
  const [campaignManager, setcampaignManager] = React.useState([]);
  const history = useHistory();

  const CampaignManagerResponse = () => {
    axios
      .get(`${API_MARKETING}/campaign-manager`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((response) => setcampaignManager(response.data));
  };

  useEffect(() => {
    CampaignManagerResponse();
  }, []);

  const postCampaignData = (data) => {
    let CampiagnMngId = 0;
    campaignManager.campaignManagerData.map((item) => {
      let key = data.type;
      if (data.type === 'voiceMail') {
        key = 'rvm';
      }
      if (data.type === 'social_post' || data.type === 'social_ad') {
        key = data.selectedSocialMediaType;
      }
      if (item.name === key) {
        CampiagnMngId = item.id;
      }
      return null;
    });
    setBtnDisable(true);
    const date = moment(startDate).format('YYYY-MM-DD');
    const time = moment(startTime).format('HH-mm-ss');
    const momentObj = moment(date + time, 'YYYY-MM-DDLT');
    const scheduleLater = momentObj.format('YYYY-MM-DDTHH:mm:ssZ');

    const dateTimeObj = moment(new Date()).add(10, 'seconds');
    const scheduleNow = dateTimeObj.format('YYYY-MM-DDTHH:mm:ssZ');
    const emailData = JSON.stringify({
      type: data.type,
      isDraft: false,
      isPin: false,
      data: {
        campaignName: data.campaignName,
        url: data.type !== 'text' ? `<a href='${data.url}' title='${data.campaignName}'>${data.url}</a>` : data.url,
        subject: data.subject,
        content: data.content,
        fileUrl: data.fileUpload ? data.fileUpload : '',
        linkedLibraries: data.linkedLibraries,
        productIds: data.productIds,
        recipientIds: data.recipientIds,
        scheduleAt: isChecked ? scheduleNow : scheduleLater,
        isSalesfeed: data.isSalesfeed,
        remindAt,
        fileType: data.fileType ? data.fileType : 'application/text',
        folderId: '',
        campaignManagerId: CampiagnMngId
      }
    });
    const config = {
      method: 'post',
      url: `${API_MARKETING}/create`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('bearToken')}`
      },
      data: emailData
    };
    axios(config)
      .then((response) => {
        if (response.data) {
          toast.success('Campaign created successfully');
          const Cleardata = null;
          dispatch(clearAllCampaignData(Cleardata));
          history.push('/admin/campaigns');
        } else {
          setBtnDisable(false);
        }
      })
      .catch((error) => {
        toast.error(error);
        setBtnDisable(false);
      });
  };

  if (isSaveDraft && callbackFn) {
    setCallBackFn(false);
    const date = moment(startDate).format('YYYY-MM-DD');
    const time = moment(startTime).format('HH-mm-ss');
    const momentObj = moment(date + time, 'YYYY-MM-DDLT');
    const scheduleLater = momentObj.format('YYYY-MM-DDTHH:mm:ssZ');

    const dateTimeObj = moment(new Date()).add(10, 'seconds');
    const scheduleNow = dateTimeObj.format('YYYY-MM-DDTHH:mm:ssZ');

    const saveDraftObj = {
      scheduleAt: isChecked ? scheduleNow : scheduleLater,
    };
    getData(saveDraftObj);
  }

  const onClickNext = () => {
    const data = {
      scheduleNow: !isChecked,
      scheduleLater: isChecked,
      scheduledDate: startDate,
      scheduledTime: startTime,
      isSalesfeed: postCampaign
    };

    const mergeTotalCampaignData = { ...campaignFormData, ...data };
    dispatch(scheduleCampaign(mergeTotalCampaignData));
    postCampaignData(mergeTotalCampaignData);
  };

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const postCampaignHandleChange = () => {
    setPostCampaign(!postCampaign);
  };

  const onChange = (date) => {
    setStartDate(date);
  };

  const onTimeChange = (time) => {
    setStartTime(time);
  };

  const dropDownhandleChange = (event) => {
    setRemindAt(event.target.value);
  };

  const getDisabledHours = () => {
    var hours = [];
    for (let i = 0; i < moment(startDate).hour(); i++) {
      hours.push(i);
    }
    return hours;
  }

  const getDisabledMinutes = (selectedHour) => {
    const minutes = [];
    if (selectedHour === moment(startDate).hour()) {
      for (let i = 0; i <= moment(startDate).minute(); i++) {
        minutes.push(i);
      }
    }
    return minutes;
  };

  return (
    <div>
      <div className="campaign-text">When should we run this campaign?</div>
      <hr className="division" />
      <div className="schedule">
        <div>
          <div className="radio-btn">
            <Checkbox
              icon={<CircleUnchecked style={{ fill: 'rgba(0, 0, 0, 0.4)' }} />}
              checkedIcon={<CircleCheckedFilled style={{ fill: '#367C2C' }} />}
              checked={isChecked}
              onChange={handleChange}
            />
            <div className="schedule-reminder">Now</div>
          </div>
        </div>
        <div>
          <div className="radio-btn">
            <Checkbox
              icon={<CircleUnchecked style={{ fill: 'rgba(0, 0, 0, 0.4)' }} />}
              checkedIcon={<CircleCheckedFilled style={{ fill: '#367C2C' }} />}
              checked={!isChecked}
              onChange={handleChange}
            />
            <div className="schedule-reminder">Schedule for later</div>
          </div>
        </div>

        {!isChecked
          ? (
            <>
              <DatePicker
                value={startDate}
                onChange={(date) => { onChange(date); }}
                inline
                minDate={new Date()}
                selectsStart
                selected={startDate}
              />

              <div className="time-picker">
                {startDate && String(new Date()).split(' ')[2] === String(startDate).split(' ')[2] ?
                  <TimePicker
                    value={startTime}
                    use24Hours={true}
                    format="h:mm a"
                    onChange={(time) => onTimeChange(time)}
                    disabledHours={getDisabledHours}
                    disabledMinutes={getDisabledMinutes}
                    showNow={false}
                  />
                  :
                  <TimePicker
                    value={startTime}
                    use24Hours={true}
                    format="h:mm a"
                    onChange={(time) => onTimeChange(time)}
                    showNow={false}
                  />
                }
                <img src="/images/clock.png" alt="Logo" />
              </div>
            </>
          )
          : <div className="disable-dateTime" />}
      </div>
      <div className="campaign-internally">Share this campaign internally?</div>
      <hr className="division" />

      <div className="post-campaign">
        <Checkbox
          icon={<CircleUnchecked style={{ fill: 'rgba(0, 0, 0, 0.4)' }} />}
          checkedIcon={<CircleCheckedFilled style={{ fill: '#367C2C' }} />}
          checked={postCampaign}
          onChange={postCampaignHandleChange}
        />
        <div className="post-campaign__text">Post campaign to the Sales Feed</div>
      </div>

      <div className="send-to-customers">
        <div className="send-to-customers__text">Reps can send this campaign to customers for </div>
        <div className="schedule__days">
          <FormControl>
            <NativeSelect
              disableUnderline
              value={remindAt}
              onChange={dropDownhandleChange}
            >
              <option className="dropdown_item" value={5}>5 days</option>
              <option className="dropdown_item" value={10}>10 days</option>
              <option className="dropdown_item" value={15}>15 days</option>
            </NativeSelect>
          </FormControl>
        </div>
        <div className="send-to-customers__text">after the campaign is ran.</div>
      </div>

      <div className="socialpostnextbutton">
        <Button disabled={btnDisable} onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Done</span>
        </Button>
      </div>

    </div>
  );
};

ScheduleCampaign.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
  getData: PropTypes.func,
  isSaveDraft: PropTypes.bool
};

ScheduleCampaign.defaultProps = {
  campaignFormData: {},
  getData: () => { },
  isSaveDraft: false
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(ScheduleCampaign);
