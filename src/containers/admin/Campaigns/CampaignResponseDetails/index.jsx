import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import FileSaver from 'file-saver';
import { getPngData } from 'recharts-to-png';
import AnalyticsCard from '../../../../components/common/AnalyticsCard';
import CustomDropdown from '../../../../components/common/CustomDropdown';
import {
  ANALYTICS_TYPES,
  CONVERSION,
  API_MARKETING
} from '../../../../constants';
import Chat from '../../../../assets/Icons/Header/Icon/Chat.svg';
import Expand from '../../../../assets/Icons/Header/Icon/Expand.svg';
import './index.scss';
import AnalyticsChatCampaign from '../CampaignAnalytics/AnalyticsChatCampaign';

const CampaignResponseDetails = (props) => {
  const { onViewOpenDetails, campaignFormData, campaignId } = props;
  const [showChat, setShowChat] = useState(false);
  const [chart, setChart] = useState();
  const [piechartResponse, setpieChartResponse] = useState([]);
  const [filters, setFilters] = useState('');
  const [linkedInAPI, setLinkedInAPI] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dropDownData, setDropDownData] = useState();

  const linkedInDataAPI = (type) => {
    if (startDate !== undefined && endDate !== undefined) {
      const draftData = JSON.stringify({
        campaignId,
        start: startDate && startDate
          ? startDate
          : new Date(new Date().getTime()
            - (180 * 24 * 60 * 60 * 1000)),
        end: endDate && endDate ? endDate : new Date(new Date().getTime()
          - (1 * 24 * 60 * 60 * 1000)),
        type: type && type ? type : 'month'
      });
      const config = {
        method: 'post',
        url: `${API_MARKETING}/share-analytics`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        },
        data: draftData
      };

      axios(config)
        .then((response) => {
          if (response.data) {
            setLinkedInAPI(response.data);
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const pieChartDataApi = () => {
    axios
      .get('http://localhost:3000/semiCircleChartData')
      .then((respo) => setpieChartResponse(respo.data));
  };
  useEffect(() => {
    pieChartDataApi();
    linkedInDataAPI(filters);
  }, [filters, startDate, endDate]);

  const handleDownload = React.useCallback(async () => {
    const pngData = await getPngData(chart);
    FileSaver.saveAs(pngData, 'test.png');
  }, [chart]);

  const pieChartData = () => {
    const semipiechart = am4core.create('chartdiv', am4charts.PieChart);

    semipiechart.data = piechartResponse;
    semipiechart.radius = am4core.percent(70);
    semipiechart.innerRadius = am4core.percent(40);
    semipiechart.startAngle = 180;
    semipiechart.endAngle = 360;

    const series = semipiechart.series.push(new am4charts.PieSeries());
    series.dataFields.value = 'value';
    series.dataFields.country = 'country';
    series.colors.list = [
      am4core.color('#FF6384'),
      am4core.color('#FBC02D'),
      am4core.color('#efcc00'),
    ];

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;

    semipiechart.legend = new am4charts.Legend();
  };

  const toggleChat = () => {
    setShowChat(!showChat);
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
  return (
    <>
      <div className="viewdetails_container">
        <div className="left_container">
          <div className="summarydiv" onClick={() => { onViewOpenDetails('0'); }}>
            <img src={Expand} className="backicon" alt="" />
            <span className="summarytext">Back to Summary</span>
          </div>
          <div>
            <div className="flex justify-between">
              <AnalyticsCard label={campaignFormData && campaignFormData.selectedCardType} value={campaignFormData && campaignFormData.selectedCardCount[campaignFormData.selctedGraphData[0]]} type="number" />
            </div>
          </div>
          <div className="analytics_response_details_filters">
            <CustomDropdown
              data={ANALYTICS_TYPES}
              value={filters}
              placeholder={dropDownData && dropDownData ? dropDownData : '6 Months'}
              onChange={(value) => onFilterChange(value)}
            />
          </div>
          <div className="converion_response_details_filters">
            <CustomDropdown
              data={CONVERSION}
              value="Conversion"
              placeholder="Conversion"
            />
          </div>
        </div>
        <div className="chartdiv">
          {pieChartData()}
        </div>
        <div className="chatresponsediv">
          <Button className="chatresponsebutton" onClick={toggleChat}>
            <img className="chatresponseicon" src={Chat} alt="" />
          </Button>
          <div className="viewdetails_analytics-chat">
            <div className="viewdetails_chatcontent">
              <AnalyticsChatCampaign
                isOpen={showChat}
                toggleChat={toggleChat}
                chat
              />
            </div>
          </div>
        </div>
      </div>
      <div className="graph_response_details">
        <ResponsiveContainer width="80%">
          <LineChart
            ref={(ref) => setChart(ref)}
            data={linkedInAPI.responseData}
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
              campaignFormData
              && campaignFormData.selctedGraphData.map((ele) => (
                <Line
                  type="monotone"
                  dataKey={ele}
                  stroke="#FF6384"
                  activeDot={{ r: 8 }}
                />
              ))
            }
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="details_shareBtn">
        <div className={showChat ? 'showShareChatBtn' : 'view_details_sharechat'}>
          <Button onClick={() => { handleDownload(); }}>
            <span className="sharebutton">Share in Chat</span>
          </Button>
        </div>
      </div>
    </>
  );
};

CampaignResponseDetails.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
  onViewOpenDetails: PropTypes.func,
  campaignId: PropTypes.string,
};

CampaignResponseDetails.defaultProps = {
  campaignFormData: {},
  onViewOpenDetails: () => { },
  campaignId: ''
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});

export default connect(mapStateToProps, null)(CampaignResponseDetails);
