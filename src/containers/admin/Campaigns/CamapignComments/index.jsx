import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import Chat from '../../../../assets/Icons/Header/Icon/Chat.svg';
import CustomIcon from '../../../../components/common/CustomIcon';
import './index.scss';
import { API_MARKETING } from '../../../../constants';
import AnalyticsChatBody from '../../../../components/AnalyticsChatBody';

const CamapignComments = (props) => {
  const { campaignId } = props;
  const [commentsResponse, setCommentsResponse] = useState([]);
  const [commentsFilterResponse, setCommentsFilterResponse] = useState([]);
  const [search, setSearch] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [loader, setLoader] = useState(true);

  const commentsTableDataAPi = () => {
    const config = {
      method: 'get',
      url: `${API_MARKETING}/comments?campaign_id=${campaignId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('bearToken')}`
      }
    };
    axios(config)
      .then((response) => {
        setLoader(false);
        if (response.data.statusCode === 200) {
          setCommentsResponse(response.data.responseData);
          setCommentsFilterResponse(response.data.responseData);
        } else if (response.data.statusCode === 202) {
          toast.error(response.data.message, { autoClose: 10000 });
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  useEffect(() => {
    commentsTableDataAPi();
  }, []);
  const onSearch = debounce((txt) => {
    if (txt !== '') {
      const searchData = commentsFilterResponse.filter((item) => (
        item.name.toLowerCase().indexOf(txt.toLowerCase()) >= 0
        || item.comment.toLowerCase().indexOf(txt.toLowerCase()) >= 0));
      setCommentsResponse(searchData);
    } else {
      setCommentsResponse(commentsFilterResponse);
    }
  }, 500);
  const searchHandler = (searchText) => {
    onSearch(searchText);
    setSearch(searchText);
  };
  const toggleChat = (openCloseChat) => {
    setShowChat(openCloseChat);
  };
  const CommentsDataDisplay = (item) => {
    const { name, comment, createdAt } = item;
    const createdDate = moment(createdAt).format('L');
    const createdTime = moment(createdAt).format('hh:mm a');
    return (
      <TableRow key={name}>
        <TableCell scope="row">
          {name}
        </TableCell>
        <TableCell>{comment}</TableCell>
        <TableCell>{createdDate}</TableCell>
        <TableCell>{createdTime}</TableCell>
      </TableRow>
    );
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
            <div className="commentssection">
              <div className="chat_search_comment">
                <div className="commentsSearchResponseTabs">
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
                      className="comment_searchicon"
                      onClick={() => {
                        onSearch('');
                        setSearch('');
                      }}
                    />
                  )
                    : <CustomIcon className="comment_searchicon" icon="Search" />}
                </div>
                <div className="comments_chatdiv">
                  <Button className="chatbutton" onClick={() => { toggleChat(!showChat); }}>
                    <img className="chaticon" src={Chat} alt="" />
                  </Button>
                  <div className="chatPage">
                    {showChat
                      ? <AnalyticsChatBody toggleChat={toggleChat} />
                      : null}
                  </div>
                </div>
              </div>
              <div className="commentsmain">
                <Table size="small" className="commentsTable">
                  <TableHead>
                    <TableRow className="table-response-header">
                      <TableCell> Name </TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>on</TableCell>
                      <TableCell>at</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commentsResponse && commentsResponse.length > 0
                      && commentsResponse.map((item) => (
                        CommentsDataDisplay(item)
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )
      }
    </>
  );
};

CamapignComments.propTypes = {
  campaignId: PropTypes.string,
};

CamapignComments.defaultProps = {
  campaignId: ''
};

export default CamapignComments;
