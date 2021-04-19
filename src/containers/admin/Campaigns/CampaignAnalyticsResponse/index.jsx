/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import FileSaver from 'file-saver';
import { getPngData } from 'recharts-to-png';
import { useHistory } from 'react-router-dom';
import CampaignAnalyticsModal from '../../../../components/CampaignAnalyticsModal';
import AnalyticsCard from '../../../../components/common/AnalyticsCard';
import Loader from '../../../../components/common/Loader';
import CustomDropdown from '../../../../components/common/CustomDropdown';
import { ANALYTICS_TYPES } from '../../../../constants';
import Chat from '../../../../assets/Icons/Header/Icon/Chat.svg';
import Expand from '../../../../assets/Icons/Header/Icon/Expand.svg';
import AnalyticsChatCampaign from '../CampaignAnalytics/AnalyticsChatCampaign';
import './index.scss';

const color = ['#4DC9F6', '#82ca9d', '#FF6384', 'orange'];
// const access_token =
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2M
// TQ0MzkwOTMsImV4cCI6MTY0NTk3NTA5M30.
// F76J6idaX6XIsHmWF1pg7uZjNFcwD1Bzcu5aAqdC2pk';

// const config = {
//   headers: { Authorization: `Bearer ${access_token}` }
// };
const CampaignAnalyticsResponse = (props) => {
  const { onViewOpenDetails, count } = props
  const history = useHistory();
  const { data, loading } = useSelector((state) => state.products.stats);
  const [chart, setChart] = useState();
  const [apiResponse, setApiResponse] = useState([]);
  const [cardData, setCardData] = useState([]);
  const defaultAnalytics = ['opens', 'clicks', 'response', 'leads'];
  const [analytics, setAnalytics] = useState();
  let [clickedData, setClickedData] = useState([]);
  const [isShareModal, setIsShareModal] = useState(false);
  const [filters, setFilters] = useState('');

  const graphDataApi = () => {
    axios
      .get('http://localhost:3000/grpahData')
      .then((response) => setApiResponse(response.data));
  };

  useEffect(() => {
    graphDataApi(filters);
  }, [filters]);

  const cardDataApi = () => {
    axios
      .get('http://localhost:3000/cardData')
      .then((response) => setCardData(response.data));
  };

  useEffect(() => {
    graphDataApi(filters);
    setFilters('month');
    cardDataApi();
    setAnalytics(defaultAnalytics);
    const timer = setInterval(() => {
      if (localStorage.getItem('selectedAnalyticsItem')) {
        setClickedData(JSON.parse(localStorage.getItem('selectedAnalyticsItem')));
        setAnalytics(clickedData);
      }
    }, 500);
    clearInterval(timer);
  }, [clickedData, setAnalytics, setClickedData]);

  const handleLineChart = (selectedItem) => {
    if (localStorage.getItem('selectedAnalyticsItem')) {
      clickedData = JSON.parse(localStorage.getItem('selectedAnalyticsItem'));
    }
    if (
      clickedData && clickedData.length > 0
      && clickedData.indexOf(selectedItem) > -1
    ) {
      clickedData.splice(clickedData.indexOf(selectedItem), 1);
      localStorage.setItem('selectedAnalyticsItem', JSON.stringify(clickedData));
    } else {
      clickedData.push(selectedItem);
      localStorage.setItem('selectedAnalyticsItem', JSON.stringify(clickedData));
    }
    setAnalytics(() => [clickedData]);
  };

  const handleDownload = React.useCallback(async () => {
    const pngData = await getPngData(chart);
  })

  const onViewLeadDetails = () => {
    history.push('/campaign/social');
  };

  const onFilterChange = (filterVal) => {
    if (filterVal.includes('months')) {
      setFilters('month');
    } else {
      setFilters('day');
    }
  };
  const toggleIsShareModal = () => {
    setIsShareModal(!isShareModal);
  };

  return (
    <>
      <div>
        <div className="summarydiv" onClick={() => { onViewOpenDetails('0'); }}>
          <img src={Expand} className="backicon" alt="" />
          <span className="summarytext">Back</span>
        </div>
        {loading ? <Loader /> : (
          <div className="analytics-response-group">
            <div className="flex justify-between stats-group-analytics-response-opens" onClick={() => { handleLineChart('opens'); }}>
              <AnalyticsCard label="OPENS" value={cardData.map((item) => (item.opens))} />
            </div>
            <div className="flex justify-between stats-group-analytics-response-clicks" onClick={() => { handleLineChart('clicks'); }}>
              <AnalyticsCard label="CLICKS" value={cardData.map((item) => (item.clicks))} type="number" />
            </div>
            <div className="flex justify-between stats-group-analytics-response-card" onClick={() => { handleLineChart('response'); }}>
              <AnalyticsCard label="RESPONSES" value={cardData.map((item) => (item.responses))} type="number" viewDetails="true" onViewOpenDetails={onViewOpenDetails} count={count} />
            </div>
            <div className="flex justify-between stats-group-analytics-response-leads" onClick={() => { handleLineChart('leads'); }}>
              <AnalyticsCard label="LEADS" value={cardData.map((item) => (item.leads))} type="number" viewDetails="true" onViewOpenDetails={onViewOpenDetails} count={count}/>
            </div>
          </div>
        )}

        <div className="analytics_response_filters">
          <CustomDropdown
            data={ANALYTICS_TYPES}
            value={filters}
            placeholder="6 Months"
            onChange={(value) => onFilterChange(value)}
          />
        </div>

        <div className="chatdiv">
          <Button className="chatbutton" onClick={toggleIsShareModal}>
            <img className="chaticon" src={Chat} alt="" />
            <AnalyticsChatCampaign
              isOpen={isShareModal}
              toggle={toggleIsShareModal}
              chat
            />
          </Button>
        </div>

        <div className="graph_response_conatiner">
          <LineChart
            ref={(ref) => setChart(ref)}
            data={apiResponse}
            height={450}
            width={1151}
            margin={{
              top: 5, right: 30, left: 20, bottom: 25
            }}
          >
            <XAxis dataKey="month" />
            <YAxis dataKey="yaxisData" />
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

        <div className="sharechat">
          <Button onClick={() => { handleDownload(); }}>
            <span className="sharebutton">Share in Chat</span>
          </Button>
        </div>
      </div>

    </>
  );
};

export default CampaignAnalyticsResponse;
