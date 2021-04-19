/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import FileSaver from 'file-saver';
import { getPngData } from 'recharts-to-png';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import CampaignAnalyticsModal from '../../../../components/CampaignAnalyticsModal';
import AnalyticsCard from '../../../../components/common/AnalyticsCard';
import Loader from '../../../../components/common/Loader';
import CustomDropdown from '../../../../components/common/CustomDropdown';
import { ANALYTICS_TYPES } from '../../../../constants';
import Expand from '../../../../assets/Icons/Header/Icon/Expand.svg';
import './index.scss';

const color = ['#4DC9F6', '#82ca9d', '#FF6384', 'orange', 'red', 'black'];
const CampaignSocialAnalytics = () => {
  const history = useHistory();
  const { data, loading } = useSelector((state) => state.products.stats);
  const [apiResponse, setApiResponse] = useState([]);
  const [chart, setChart] = useState();
  const [cardData, setCardData] = useState([]);
  const defaultAnalytics = ['impressions', 'reactions', 'comments', 'clicks', 'messages', 'leads'];
  const [analytics, setAnalytics] = useState();
  let [clickedData, setClickedData] = useState([]);

  const graphDataApi = () => {
    axios
      .get('http://localhost:3000/socialGraphData')
      .then((res) => setApiResponse(res.data));
  };

  const cardDataApi = () => {
    axios
      .get('http://localhost:3000/socialCardData')
      .then((response) => setCardData(response.data));
  };

  useEffect(() => {
    graphDataApi();
    cardDataApi();
    setAnalytics(defaultAnalytics);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (localStorage.getItem('selectedSocialItem')) {
        setClickedData(JSON.parse(localStorage.getItem('selectedSocialItem')));
        setAnalytics(clickedData);
      }
    }, 500);
    return () => (clearInterval(timer));
  }, [clickedData, setAnalytics, setClickedData]);

  const handleDownload = React.useCallback(async () => {
    const pngData = await getPngData(chart);
    FileSaver.saveAs(pngData, 'test.png');
  }, [chart]);

  const handleLineChart = (selectedItem) => {
    if (localStorage.getItem('selectedSocialItem')) {
      clickedData = JSON.parse(localStorage.getItem('selectedSocialItem'));
    }
    if (
      clickedData && clickedData.length > 0
      && clickedData.indexOf(selectedItem) > -1
    ) {
      clickedData.splice(clickedData.indexOf(selectedItem), 1);
      localStorage.setItem('selectedSocialItem', JSON.stringify(clickedData));
    } else {
      clickedData.push(selectedItem);
      localStorage.setItem('selectedSocialItem', JSON.stringify(clickedData));
    }
    setAnalytics(() => [clickedData]);
  };

  const onViewOpenDetails = () => {
    history.push('/admin/campaigns/analytics/response');
  };

  return (
    <>
      <div>
        {loading ? <Loader /> : (
          <div className=" analytics-group">
            <div className="flex justify-between social-group-analytics" onClick={() => { handleLineChart('impressions'); }}>
              <AnalyticsCard label="IMPRESSIONS" value={cardData.map((item) => (item.impressions))} type="number" />
              <div className="opendetails">
                <span className="response_open_text" onClick={() => onViewOpenDetails()}>View Details</span>
                <img src={Expand} className="openicon" alt="" />
              </div>
            </div>
            <div className="flex justify-between social-group-reactions" onClick={() => { handleLineChart('reactions'); }}>
              <AnalyticsCard label="REACTIONS" value={cardData.map((item) => (item.reactions))} type="number" />
            </div>
            <div className="flex justify-between social-group-response-comments" onClick={() => { handleLineChart('comments'); }}>
              <AnalyticsCard label="COMMENTS" value={cardData.map((item) => (item.comments))} type="number" />
            </div>
            <div className="flex justify-between social-group-clicks" onClick={() => { handleLineChart('clicks'); }}>
              <AnalyticsCard label="CLICKS" value={cardData.map((item) => (item.clicks))} type="number" />
            </div>
            <div className="flex justify-between social-group-messages" onClick={() => { handleLineChart('messages'); }}>
              <AnalyticsCard label="MESSAGES" value={cardData.map((item) => (item.messages))} type="number" />
            </div>
            <div className="flex justify-between social-group-lead" onClick={() => { handleLineChart('leads'); }}>
              <AnalyticsCard label="LEADS" value={cardData.map((item) => (item.leads))} type="number" />
            </div>
          </div>
        )}

        <div className="analytics__filters_social">
          <CustomDropdown
            data={ANALYTICS_TYPES}
            value="6 months"
            placeholder="Type"
          />
        </div>
        <div className="graph-conatiner_social">
          <LineChart
            ref={(ref) => setChart(ref)}
            data={apiResponse}
            height={351}
            width={800}
            margin={{
              top: 5, right: 30, left: 20, bottom: 25
            }}
          >
            <XAxis dataKey="month" />
            <YAxis datakey="value" />
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Legend />
            {
              analytics && analytics.map((ele, index) => (
                <Line type="monotone" dataKey={ele} stroke={color[index]} activeDot={{ r: 8 }} />
              ))
            }            
          </LineChart>
        </div>
        <div className="analytics-chat">
          <div className="chatcontent">
          </div>
        </div>
        <div className="sharechat">
          <Button onClick={() => { handleDownload(); }}>
            <span className="sharebutton">Share in Chat</span>
          </Button>
        </div>

      </div>

    </>

  );
};

export default CampaignSocialAnalytics;
