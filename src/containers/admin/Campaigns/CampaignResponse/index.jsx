import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Card
} from '@material-ui/core';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import Chat from '../../../../assets/Icons/Header/Icon/Chat.svg';
import Filter from '../../../../assets/Icons/Header/Icon/Filter.svg';
import CustomIcon from '../../../../components/common/CustomIcon';
import CustomDropdown from '../../../../components/common/CustomDropdown';
import { RESPONSETYPE, API_MARKETING } from '../../../../constants';
import './index.scss';
import AnalyticsChatBody from '../../../../components/AnalyticsChatBody';

const CampaignMessages = (props) => {
  const { campaignId } = props;
  const [apiTableResponse, setApiTableResponse] = useState([]);
  const [FilterResponse, setFilterResponse] = useState([]);
  const [search, setSearch] = useState('');
  const filters = useState({ filter: '' });
  const [isVisible, setIsVisible] = useState(false);
  const [selctedItem, setSelectedItem] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [loader, setLoader] = useState(true);

  const responseTableDataApi = () => {
    const config = {
      method: 'get',
      url: `${API_MARKETING}/message?campaign_id=${campaignId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('bearToken')}`
      }
    };
    axios(config)
      .then((response) => {
        setLoader(false);
        if (response.data.statusCode === 200) {
          setApiTableResponse(response.data.responseData);
          setFilterResponse(response.data.responseData);
        } else if (response.data.statusCode === 202) {
          toast.error(response.data.message, { autoClose: 10000 });
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  useEffect(() => {
    responseTableDataApi();
  }, []);

  const onSearch = debounce((txt) => {
    if (txt !== '') {
      const searchData = FilterResponse.filter(
        (item) => (item.first_name.toLowerCase().indexOf(txt.toLowerCase()) >= 0
          || item.last_name.toLowerCase().indexOf(txt.toLowerCase()) >= 0)
      );
      setApiTableResponse(searchData);
    } else {
      setApiTableResponse(FilterResponse);
    }
  }, 500);
  const searchHandler = (searchText) => {
    onSearch(searchText);
    setSearch(searchText);
  };

  const onFilterChange = (filterVal) => {
    FilterResponse.forEach(() => {
      if (filterVal === 'unassigned') {
        const searchData = FilterResponse.filter(
          (item) => (item.assignee === null)
        );
        setApiTableResponse(searchData);
      } else if (filterVal === 'all') {
        setApiTableResponse(FilterResponse);
      } else {
        setApiTableResponse([]);
      }
    });
  };
  const toggleChat = (openCloseChat) => {
    setShowChat(openCloseChat);
  };
  const assigningTo = (item) => {
    setIsVisible(true);
    setSelectedItem(item.id);
  };

  const changeAssign = (assignee, item) => {
    apiTableResponse.filter((res) => {
      if (res.id === item.id) {
        const changeData = res;
        changeData.assignTo = assignee;
      }
      return res;
    });
    setApiTableResponse(apiTableResponse);
    setIsVisible(false);
    setSelectedItem('');
  };
  return (
    <>
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
          ) : (
            <div className="responsesection">
              <div>

                <div className="message_chatdiv">
                  <Button className="chatbutton" onClick={() => { toggleChat(!showChat); }}>
                    <img className="chaticon" src={Chat} alt="" />
                  </Button>
                  <div className="chatPage">
                    {showChat
                      ? <AnalyticsChatBody toggleChat={toggleChat} />
                      : null}
                  </div>
                </div>
                <div className="message_searchResponseTabs">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => searchHandler(e.target.value)}
                  />
                  {search ? (
                    <CustomIcon
                      icon="clear"
                      className="searchicon"
                      onClick={() => {
                        onSearch('');
                        setSearch('');
                      }}
                    />
                  )
                    : <CustomIcon className="searchicon" icon="Search" />}
                </div>
                <div className="message_response_filters">
                  <CustomDropdown
                    data={RESPONSETYPE}
                    value={filters}
                    placeholder="All"
                    onChange={(value) => onFilterChange(value)}
                    className="response_filters_item"
                  />

                </div>
                <div className="message_response_header_title">
                  <span className="response_header_text">
                    Most Recent
                    <img className="recentIcon" src={Filter} alt="" />
                  </span>
                </div>
              </div>
              <div className="message_responsemain">
                <Table size="small" className="responseTable">
                  <TableHead>
                    <TableRow className="table-response-header">
                      <TableCell> Date </TableCell>
                      <TableCell>Customer Type</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email Address</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Last Purchase</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Assign To</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      apiTableResponse && apiTableResponse.length > 0
                      && apiTableResponse.map((item) => (
                        <TableRow key={item.time}>
                          <TableCell scope="row">
                            {moment(item.time).format('L')}
                          </TableCell>
                          <TableCell>{item.customerType}</TableCell>
                          <TableCell>{item.first_name}</TableCell>
                          {item.last_name
                            ? <TableCell>{item.last_name}</TableCell>
                            : <TableCell style={{ color: '#707580' }}>NA</TableCell>}
                          {item.email
                            ? <TableCell>{item.email}</TableCell>
                            : <TableCell style={{ color: '#707580' }}>NA</TableCell>}
                          {item.phone
                            ? <TableCell>{item.phone}</TableCell>
                            : <TableCell style={{ color: '#707580' }}>NA</TableCell>}
                          {item.last_purchase
                            ? <TableCell>{item.last_purchase}</TableCell>
                            : <TableCell style={{ color: '#707580' }}>NA</TableCell>}
                          {item.state
                            ? <TableCell>{item.state}</TableCell>
                            : <TableCell style={{ color: '#707580' }}>NA</TableCell>}
                          {item.city
                            ? <TableCell>{item.city}</TableCell>
                            : <TableCell style={{ color: '#707580' }}>NA</TableCell>}
                          <TableCell style={{ position: 'relative' }}>
                            <div
                              onClick={() => (item.assignTo ? null
                                : assigningTo(item))}
                            >
                              {item.assignTo ? item.assignTo : 'Assign'}
                              {isVisible && selctedItem === item.id
                                ? (
                                  <Card className="assign_drpdwnVisible">
                                    <div className="assignee_txt" onClick={() => { changeAssign('Mike Elmer', item); }}>Mike Elmer</div>
                                    <div className="assignee_txt" onClick={() => { changeAssign('Josh Evans', item); }}>Josh Evans</div>
                                    <div className="assignee_txt" onClick={() => { changeAssign('Ryan King', item); }}>Ryan King</div>
                                  </Card>
                                )
                                : null}
                            </div>
                          </TableCell>
                          {item.status
                            ? <TableCell>{item.status}</TableCell>
                            : <TableCell style={{ color: '#707580' }}>NA</TableCell>}
                        </TableRow>

                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            </div>
          )
      }
    </>
  );
};

CampaignMessages.propTypes = {
  campaignId: PropTypes.string,
};

CampaignMessages.defaultProps = {
  campaignId: ''
};

export default CampaignMessages;
