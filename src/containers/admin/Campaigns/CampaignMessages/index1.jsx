/* eslint-disable */
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
import CampaignAnalyticsModal from '../../../../components/CampaignAnalyticsModal';
import Chat from '../../../../assets/Icons/Header/Icon/Chat.svg';
import Filter from '../../../../assets/Icons/Header/Icon/Filter.svg';
import CustomIcon from '../../../../components/common/CustomIcon';
import CustomDropdown from '../../../../components/common/CustomDropdown';
import { RESPONSETYPE } from '../../../../constants';
import AnalyticsChatCampaign from '../CampaignAnalytics/AnalyticsChatCampaign';
import './index.scss';

const CampaignMessages = () => {
  const [apiTableResponse, setApiTableResponse] = useState([]);
  const [FilterResponse, setFilterResponse] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ filter: '' });
  const [isShareModal, setIsShareModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selctedItem, setSelectedItem] = useState('');

  const responseTableDataApi = () => {
    axios
      .get('http://localhost:3000/responseData')
      .then((res) => {
        setApiTableResponse(res.data);
        setFilterResponse(res.data);
      });
  };
  useEffect(() => {
    responseTableDataApi();
  }, []);

  const onSearch = debounce((txt) => {
    if (txt !== '') {
      const searchData = FilterResponse.filter(
        (item) => (item.firstName.toLowerCase().indexOf(txt.toLowerCase()) >= 0
          || item.lastName.toLowerCase().indexOf(txt.toLowerCase()) >= 0)
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
    const newData = [];
    FilterResponse.forEach((item) => {
      if (item.value === filterVal) {
        newData.push(item);
      }
    });
    setApiTableResponse(newData);
  };
  const toggleIsShareModal = () => {
    setIsShareModal(!isShareModal);
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
      <div className="responsesection">
        <div>

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
          <div className="searchResponseTabs">
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
          <div className="response_filters">
            <CustomDropdown
              data={RESPONSETYPE}
              value={filters}
              placeholder="All"
              onChange={(value) => onFilterChange(value)}
              className="response_filters_item"
            />

          </div>
          <div className="response_header_title">
            <span className="response_header_text">
              Most Recent
              <img className="recentIcon" src={Filter} alt="" />
            </span>
          </div>
        </div>
        <div className="responsemain">
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

                apiTableResponse && apiTableResponse.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell scope="row">
                      {item.date}
                    </TableCell>
                    <TableCell>{item.customerType}</TableCell>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.emailAddress}</TableCell>
                    <TableCell>{item.phoneNumber}</TableCell>
                    <TableCell>{item.lastPurchase}</TableCell>
                    <TableCell>{item.state}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell style={{ position: 'relative' }}>
                      <div
                        onClick={() => { (item.assignTo ? null : assigningTo(item)); }}
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
                    <TableCell>{item.status}</TableCell>
                  </TableRow>

                ))
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
export default CampaignMessages;
