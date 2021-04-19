/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FileSaver from 'file-saver';
import { getPngData } from 'recharts-to-png';
import { useDispatch } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { toast } from 'react-toastify';
import AnalyticsCard from '../../../../components/common/AnalyticsCard';
import CustomDropdown from '../../../../components/common/CustomDropdown';
import Chat from '../../../../assets/Icons/Header/Icon/Chat.svg';
import AnalyticsChatCampaign from './AnalyticsChatCampaign';
import './index.scss';
import CampaignResponseDetails from '../CampaignResponseDetails';
import { campAnalyticsViewDetails } from '../../../../redux/actions';
import { API_MARKETING, ANALYTICS_TYPES } from '../../../../constants';
import AnalyticsChatBody from '../../../../components/AnalyticsChatBody';
import Loader from 'react-loader-spinner';

const color = ['#4DC9F6', '#82ca9d', '#FF6384', 'orange'];

const CampaignAnalytics = (props) => {
  const { campaignId, campaignType } = props;
  const dispatch = useDispatch();
  const [showChat, setShowChat] = useState(false);
  const [chart, setChart] = useState();
  const [detialsPage, setDetialsPage] = useState('0');
  const [analytics, setAnalytics] = useState(['impressionCount', 'clickCount', 'commentCount', 'engagement']);
  const [filters, setFilters] = useState('');
  const [linkedInAPI, setLinkedInAPI] = useState([]);
  const [change, setChange] = useState(false);
  const [selectedCard, setSelectedCard] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dropDownData, setDropDownData] = useState();
  const [loader, setLoader] = useState(true);
  const [cardCount, setCardCount] = useState({
    impressionCount: 0,
    clickCount: 0,
    commentCount: 0,
    engagement: 0
  });

  const [emailCardCount, setEmailCardCount] = useState({
    impressionCount: 0,
    clickCount: 0,
    deliveredCount: 0
  })

  const linkedInDataAPI = (type) => {
    if (startDate !== undefined && endDate !== undefined) {
      let _type = 'month';
      if(campaignType === 'social_ad'){
        if (type === 'month'){
          type = 'monthly';
        } 
        else if (type === 'day'){
          type = 'daily';
        } else {
          _type = 'monthly';
        }
      }
      const draftData = JSON.stringify({
        campaignId,
        start: startDate && startDate
          ? startDate
          : new Date(new Date().getTime()
            - (180 * 24 * 60 * 60 * 1000)),
        end: endDate && endDate ? endDate : new Date(new Date().getTime()
          - (1 * 24 * 60 * 60 * 1000)),
        type: type && type ? type : _type
      });
      const config = {
        method: 'post',
        url: campaignType === 'social_post' ? `${API_MARKETING}/share-analytics` : `${API_MARKETING}/ad-analytics`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        },
        data: draftData
      };

      axios(config)
        .then((response) => {
          setLoader(false);
          if (response.data.statusCode === 200) {
            if (response.data.responseData) {
              let impressionCount = 0;
              let clickCount = 0;
              let engagement = 0;
              let commentCount = 0;
              const campaignAnalyticsData = response.data.responseData;
              campaignAnalyticsData.map((item) => {
                impressionCount += item.impressionCount;
                clickCount += item.clickCount;
                engagement += item.engagement;
                commentCount += item.commentCount;
                return null;
              });
              setCardCount({
                impressionCount,
                clickCount,
                commentCount,
                engagement
              });
              setLinkedInAPI(response.data.responseData);
            }
          } else if (response.data.statusCode === 202) {            
            toast.error(response.data.message, { autoClose: 10000 });
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const emailCampaignAPI = () => {
    const config = {
      method: 'get',
      url: `${API_MARKETING}/email-analytics?campaignId=${campaignId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('bearToken')}`
      },
    };
    axios(config)
      .then((response) => {
        setLoader(false);
        if (response.data.responseData) {
          let impressionCount = 0;
          let clickCount = 0;
          let deliveredCount = 0;
          const campaignAnalyticsData = response.data.responseData;
          impressionCount = campaignAnalyticsData.opens;
          clickCount = campaignAnalyticsData.clicks;
          deliveredCount = campaignAnalyticsData.delivered
          setEmailCardCount({
            impressionCount,
            clickCount,
            deliveredCount
          });
          setLinkedInAPI(response.data.responseData);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  }
  
  useEffect(() => {
    if (campaignType === 'email') {
      emailCampaignAPI();
    } else {
      linkedInDataAPI(filters);
    }
  }, [filters, startDate, endDate]);

  const handleDownload = React.useCallback(async () => {
    const pngData = await getPngData(chart);
    FileSaver.saveAs(pngData, 'test.png');
  }, [chart]);

  const handleLineChart = (selectedItem) => {
    const selectedData = selectedCard;
    if (
      selectedData && selectedData.length > 0
      && selectedData.indexOf(selectedItem) > -1
    ) {
      selectedData.splice(
        selectedData.indexOf(selectedItem), 1
      );
    } else {
      selectedData.push(selectedItem);
    }
    setChange(!change);
    setSelectedCard(selectedData);
    setAnalytics(selectedData);
  };

  const dateFilter = (filterVal) => {
    if (filterVal === '12 months') {
      const last12months = new Date(new Date().getTime()
        - (360 * 24 * 60 * 60 * 1000));
      setStartDate(last12months.toISOString());
      const endof12Monthsdata = new Date(new Date().getTime()
        - (1 * 24 * 60 * 60 * 1000));
      setEndDate(endof12Monthsdata.toISOString());
    } else if (filterVal === '3 months') {
      const lat3months = new Date(new Date().getTime()
        - (90 * 24 * 60 * 60 * 1000));
      setStartDate(lat3months.toISOString());
      const endof3Monthsdata = new Date(new Date().getTime()
        - (1 * 24 * 60 * 60 * 1000));
      setEndDate(endof3Monthsdata.toISOString());
    } else if (filterVal === '30 days') {
      const lat30days = new Date(new Date().getTime()
        - (30 * 24 * 60 * 60 * 1000));
      setStartDate(lat30days.toISOString());
      const endof30days = new Date(new Date().getTime()
        - (1 * 24 * 60 * 60 * 1000));
      setEndDate(endof30days.toISOString());
    } else if (filterVal === '10 days') {
      const lat10days = new Date(new Date().getTime()
        - (10 * 24 * 60 * 60 * 1000));
      setStartDate(lat10days.toISOString());
      const endof10days = new Date(new Date().getTime()
        - (1 * 24 * 60 * 60 * 1000));
      setEndDate(endof10days.toISOString());
    } else {
      const last6months = new Date(new Date().getTime()
        - (180 * 24 * 60 * 60 * 1000));
      setStartDate(last6months.toISOString());
      const endof6Monthsdata = new Date(new Date().getTime()
        - (1 * 24 * 60 * 60 * 1000));
      setEndDate(endof6Monthsdata.toISOString());
    }
  };

  const onFilterChange = (filterVal) => {
    setDropDownData(filterVal);
    dateFilter(filterVal);
    if (filterVal.includes('months')) {
      setFilters('month');
    } else {
      setFilters('day');
    }
  };

  const onViewOpenDetails = (count, label, cardType) => {
    setDetialsPage(count);
    const selectedCardValue = [cardType];
    selectedCardValue.push();
    const analyticsViewDetails = {
      selectedCardType: label,
      analyticsApiResponse: linkedInAPI,
      selctedGraphData: selectedCardValue,
      selectedCardCount: campaignType === 'email' ? emailCardCount : cardCount
    };
    dispatch(campAnalyticsViewDetails(analyticsViewDetails));
  };

  const renderColor = (ele) => {
    if (ele === 'clickCount') return color[0];
    if (ele === 'commentCount') return color[1];
    if (ele === 'engagement') return color[2];
    if (ele === 'impressionCount') return color[3];
    return null;
  };

  const toggleChat = (openCloseChat) => {
    setShowChat(openCloseChat);
  };
  if (detialsPage === '0') {
    return (
      <div className="AnalyticSection">
        <div className="analytics_chatdiv">
          <Button className="chatbutton" onClick={() => { toggleChat(!showChat) }}>
            <img className="chaticon" src={Chat} alt="" />
          </Button>
          <div className="analytics-chat">
            {showChat ?
              <AnalyticsChatBody toggleChat={toggleChat} />
              : null}
          </div>
        </div>
        {
        loader
          ? (
            <Loader
              type="Oval"
              color="#008080"
              height={40}
              width={40}
              className="LoaderSpinner"
            />
          ) :  (
        <div className="graph_chat_div">
          <div className="graph_container">
            <div className="AnalyticsCards_dropdown">
              <div className=" analytics-group">
                <div className="flex justify-between stats-group-analytics" onClick={() => { handleLineChart('impressionCount'); }}>
                  <AnalyticsCard label="OPENS" value={campaignType === 'email' ? emailCardCount.impressionCount : cardCount.impressionCount} campaignType={campaignType} selectedClickColor={selectedCard.includes('impressionCount') === true ? 'analytics_innerCardCon impressionCountColor' : 'analytics_innerCardCon gray'} analytics={analytics} viewDetails="true" onViewOpenDetails={onViewOpenDetails} cardType="impressionCount" />
                </div>
                <div className="flex justify-between stats-group-clicks" onClick={() => { handleLineChart('clickCount'); }}>
                  <AnalyticsCard label="CLICKS" value={campaignType === 'email' ? emailCardCount.clickCount : cardCount.clickCount} campaignType={campaignType} selectedClickColor={selectedCard.includes('clickCount') === true ? 'analytics_innerCardCon clickCountColor ' : 'analytics_innerCardCon gray'} cardType="likeCount" analytics={analytics} />
                </div>
                {campaignType === 'email' ?
                  <div className="flex justify-between stats-group-response" onClick={() => { handleLineChart('commentCount'); }}>
                    <AnalyticsCard label="DELIVERED" value={emailCardCount.deliveredCount} campaignType={campaignType} selectedClickColor={selectedCard.includes('commentCount') === true ? 'analytics_innerCardCon likeCountColor' : 'analytics_innerCardCon gray'} viewDetails="true" cardType="commentCount" analytics={analytics} onViewOpenDetails={onViewOpenDetails} />
                  </div>
                  :
                  <>
                    <div className="flex justify-between stats-group-response" onClick={() => { handleLineChart('commentCount'); }}>
                      <AnalyticsCard label="RESPONSES" value={cardCount.commentCount} campaignType={campaignType} selectedClickColor={selectedCard.includes('commentCount') === true ? 'analytics_innerCardCon likeCountColor' : 'analytics_innerCardCon gray'} viewDetails="true" cardType="commentCount" analytics={analytics} onViewOpenDetails={onViewOpenDetails} />
                    </div>
                    <div className="flex justify-between stats-group-lead" onClick={() => { handleLineChart('engagement'); }}>
                      <AnalyticsCard label="LEADS" value={cardCount.engagement} type="number" analytics={analytics} selectedClickColor={selectedCard.includes('engagement') === true ? 'analytics_innerCardCon engagementColor' : 'analytics_innerCardCon gray'} viewDetails="true" cardType="engagement" onViewOpenDetails={onViewOpenDetails} />
                    </div>
                  </>
                }
              </div>
              {
                campaignType === 'email' ? 
              <div className="email_placeholder">
                30 days
              </div>
                  :
                  <div className="analytics__filters">
                    <CustomDropdown
                      data={ANALYTICS_TYPES}
                      value={filters}
                      placeholder={dropDownData && dropDownData ? dropDownData : '6 Months'}
                      onChange={(value) => onFilterChange(value)}
                    />
                  </div>
              }
            </div>            
            {
              campaignType === 'email' ? null
                :
                <div className="graph-conatiner">
                  <ResponsiveContainer width="90%">
                    <LineChart
                      ref={(ref) => setChart(ref)}
                      data={linkedInAPI}
                      margin={{
                        top: 5, right: 30, left: 20, bottom: 25
                      }}
                    >
                      <XAxis dataKey="time" />
                      <YAxis />
                      <CartesianGrid stroke="#ccc" />
                      <Tooltip />
                      <Legend />

                      {
                        analytics && analytics.map((ele) => (
                          <Line
                            type="monotone"
                            dataKey={ele}
                            stroke={renderColor(ele)}
                            activeDot={{ r: 8 }}
                          />
                        ))
                      }
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            }
            <div className={showChat ? 'showShareChatBtn' : 'sharechatBtn'}>
              <Button onClick={() => { handleDownload(); }}>
                <span className="sharebutton">Share in Chat</span>
              </Button>
            </div>
          </div>
        </div> )}
        <div id="results" />
      </div >
    );
  } if (detialsPage === '1') {
    return (<CampaignResponseDetails onViewOpenDetails={onViewOpenDetails} campaignId={campaignId} />);
  }
  return null;
};

CampaignAnalytics.propTypes = {
  campaignId: PropTypes.string,
  campaignType: PropTypes.string,
};

CampaignAnalytics.defaultProps = {
  campaignId: '',
  campaignType: ''
};

export default CampaignAnalytics;
