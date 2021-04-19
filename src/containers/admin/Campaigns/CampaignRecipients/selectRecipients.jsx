import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import Checkbox from '@material-ui/core/Checkbox';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearIcon from '@material-ui/icons/Clear';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ProfileInitials from '../../../../components/common/ProfileInitials';
import CustomIcon from '../../../../components/common/CustomIcon';
import getFullName from '../../../../utils/getFullName';
import { selectedRecipients } from '../../../../redux/actions';
import { API_MARKETING } from '../../../../constants';

const SelectRecipients = (props) => {
  const {
    apiResponse, apiCustomerResponse, getData, isSaveDraft, campaignFormData,
  } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const apiResponseRecipients = apiCustomerResponse;
  const apiResponseSelectList = apiResponse;

  const [isChecked, setIsChecked] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectCustomers, setSelectCustomers] = useState([]);
  const [change, setChange] = useState(false);
  const [searchCustomers, setSearchCustomers] = useState([]);
  const [customerListVisible, setCustomerListVisible] = useState(true);
  const [isSelectListVisible, setIsSelectListVisible] = useState(false);
  const [selectLists, setSelectLists] = useState([]);
  const [selectListItemSelected, setSelectListItemSelected] = useState([]);

  const SearchCustomerListAPI = (text) => {
    axios
      .get(`${API_MARKETING}/customers?page=1&limit=500&firstName=${text}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((res) => {
        const searchedCustomerList = res.data.customerList;
        const selectedCustomersList = selectCustomers;
        const unSelectedCustomersList = [];
        if (selectedCustomersList.length > 0) {
          searchedCustomerList.map((item) => {
            selectedCustomersList.map((element) => {
              if (item.id === element.id) {
                const selectedItem = item;
                selectedItem.selected = true;
              }
              return element;
            });
            return item;
          });
        }
        searchedCustomerList.map((item) => {
          if (!item.selected) {
            unSelectedCustomersList.push(item);
          }
          return item;
        });
        setCustomers(unSelectedCustomersList);
      });
  };

  const getSelectedRceipientIds = () => {
    if (
      campaignFormData && campaignFormData.recipientIds && apiCustomerResponse
    ) {
      const getSelectedCustomers = [];
      apiCustomerResponse.filter(
        (item) => campaignFormData.recipientIds.map(
          (element) => {
            if (item.id === element) {
              const selectedItem = item;
              selectedItem.selected = true;
              getSelectedCustomers.push(selectedItem);
            }
            return item;
          }
        )
      );
      setSelectCustomers(getSelectedCustomers);
      const unSelectedCustomers = apiCustomerResponse.filter(
        (item) => !getSelectedCustomers.find(
          (element) => element.id === item.id
        )
      );
      setCustomers(unSelectedCustomers);
    }
  };

  useEffect(() => {
    setCustomers(apiResponseRecipients);
    setSearchCustomers(apiResponseRecipients);
    setSelectLists(apiResponseSelectList);
    getSelectedRceipientIds();
  }, [apiResponseRecipients]);

  if (isSaveDraft) {
    let selectedCustomerIds = [];
    selectedCustomerIds = selectCustomers.map((item) => item.id);
    getData(selectedCustomerIds);
  }

  const onClickNext = () => {
    let selectedCustomerIds = [];
    selectedCustomerIds = selectCustomers.map((item) => item.id);

    const data = {
      selectLists: selectListItemSelected,
      recipientIds: selectedCustomerIds,
      ExcludeDoNotContact: isChecked
    };
    dispatch(selectedRecipients(data));
    history.push('/admin/campaigns/new/scheduleCampaign');
  };

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const onChangeText = (text) => {
    setSearchText(text);
    if (text.length > 3) {
      SearchCustomerListAPI(text);
    } else {
      let data = searchCustomers;
      data = searchCustomers.filter((item) => item.selected === true);

      let newData = searchCustomers;
      newData = newData.filter((ar) => !data.find((rm) => (rm.id === ar.id)));
      setCustomers(newData);
    }
  };

  const onselectReciepient = (item, i) => {
    const sampleData = customers;
    if (sampleData[i].id === item.id) {
      if (item && item.selected) {
        sampleData[i].selected = false;
      } else {
        sampleData[i].selected = true;
      }
    }
    setChange(!change);
    setCustomers(sampleData);
  };

  const selectedCustomers = () => {
    if (customerListVisible) {
      let mergeCustomers = [];
      mergeCustomers = [...selectCustomers, ...customers];
      let data = [];
      data = mergeCustomers.filter((item) => item.selected === true);
      setSelectCustomers(data);

      let newData = mergeCustomers;
      newData = newData.filter((ar) => !data.find((rm) => (rm.id === ar.id)));
      setCustomers(newData);
    } else {
      let mergeCustomers = [];
      mergeCustomers = [...selectListItemSelected, ...selectLists];

      let data = [];
      data = mergeCustomers.filter((item) => item.selected === true);
      setSelectListItemSelected(data);

      let newData = mergeCustomers;
      newData = newData.filter((ar) => !data.find((rm) => (rm.id === ar.id)));
      setSelectLists(newData);
    }
  };

  const removeSelectedrecipient = (item) => {
    if (customerListVisible) {
      let arrayData = selectCustomers;
      const newCustomers = customers;
      arrayData = arrayData.filter((ele) => {
        if (ele.id !== item.id) {
          return ele;
        }

        const selectedRecipient = item;
        selectedRecipient.selected = false;
        newCustomers.push(selectedRecipient);
        return null;
      });
      setSelectCustomers(arrayData);
      setCustomers(newCustomers);
    } else {
      let arrayData = selectListItemSelected;
      const newCustomers = selectLists;
      arrayData = arrayData.filter((ele) => {
        if (ele.id !== item.id) {
          return ele;
        }

        const selectedRecipient = item;
        selectedRecipient.selected = false;
        newCustomers.push(selectedRecipient);
        return null;
      });
      setSelectListItemSelected(arrayData);
      setSelectLists(newCustomers);
    }
  };

  const showSelectLists = () => {
    setIsSelectListVisible(!isSelectListVisible);
    setCustomerListVisible(false);
  };

  const showSelectCustomers = () => {
    setCustomerListVisible(!customerListVisible);
    setIsSelectListVisible(false);
  };

  const onselectSelectLists = (item, i) => {
    const sampleData = selectLists;
    if (sampleData[i].id === item.id) {
      if (item && item.selected) {
        sampleData[i].selected = false;
      } else {
        sampleData[i].selected = true;
      }
    }
    setChange(!change);
    setSelectLists(sampleData);
  };

  const renderCustomerList = () => (
    <div>
      <div className="search-tabs">
        <input
          vlaue={searchText}
          type="text"
          className="form-control"
          placeholder="Search"
          onChange={(e) => onChangeText(e.target.value)}
        />
        <CustomIcon className="searchIcon" icon="Search" />
      </div>

      <div className="entire-recipients">
        {
          customers && customers.map((item, index) => (
            item.selected
              ? (
                <div className="select-recipients__map">
                  <div className="selected__item" onClick={() => { onselectReciepient(item, index); }}>
                    <ProfileInitials
                      firstName={item.firstName}
                      lastName={item.lastName}
                      size="small"
                      profileId={item.id}
                    />
                    <span className="full-name">{getFullName(item)}</span>
                  </div>
                </div>
              )
              : (
                <div className="select-recipients__map">
                  <div className="total-recipients-lists" onClick={() => { onselectReciepient(item, index); }}>
                    <ProfileInitials
                      firstName={item.firstName}
                      lastName={item.lastName}
                      size="small"
                      profileId={item.id}
                    />
                    <span className="full-name">{getFullName(item)}</span>
                  </div>
                </div>
              )
          ))
        }
      </div>

    </div>

  );

  const renderSelectedCustomerList = (item, index) => (
    <div className="select-recipients__map">
      <div className="recipients-lists">
        <ProfileInitials
          firstName={item.firstName}
          lastName={item.lastName}
          profileId={item.id}
          size="small"
        />
        <span className="full-name">{getFullName(item)}</span>
        <ClearIcon className="clearIcon" onClick={() => { removeSelectedrecipient(item, index); }} />
      </div>
    </div>

  );

  const renderSelectedSelectLists = (item, index) => {
    if (isSelectListVisible) {
      return (
        <div className="select-recipients__map">
          <div className="recipients-lists">
            <span className="full-name">{item.name}</span>
            {
              item.recent
                ? (
                  <div className="svg__icon">
                    <OfflineBoltIcon style={{ size: 'small', stroke: '#A17112', fill: '#ffffff' }} />
                  </div>
                )
                : null
            }
            <ClearIcon className="clearIcon" onClick={() => { removeSelectedrecipient(item, index); }} />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="recipients-container">
        <div className="recipients-list">
          <div className="right-icon-recipents">

            {isSelectListVisible
              ? <ArrowDropDownIcon onClick={() => { showSelectLists(); }} />
              : <ArrowRightIcon onClick={() => { showSelectLists(); }} />}

            <div className="select-lists">Select Lists</div>
          </div>
          {isSelectListVisible
            ? (
              <div className="entire-recipients">
                {
                  selectLists && selectLists.map((item, index) => (
                    item.selected
                      ? (
                        <div className="select-recipients__map">
                          <div className="selected__item" onClick={() => { onselectSelectLists(item, index); }}>
                            <span className="full-name">{item.name}</span>
                            {
                              item.recent === true
                                ? (
                                  <div className="svg__icon">
                                    <OfflineBoltIcon style={{ size: 'small', stroke: '#A17112', fill: '#ffffff' }} />
                                  </div>
                                )
                                : null
                            }
                          </div>
                        </div>
                      )
                      : (
                        <div className="select-recipients__map">
                          <div className="total-recipients-lists" onClick={() => { onselectSelectLists(item, index); }}>
                            <span className="full-name">{item.name}</span>
                            {
                              item.recent === true
                                ? (
                                  <div className="svg__icon">
                                    <OfflineBoltIcon style={{ size: 'small', stroke: '#A17112', fill: '#ffffff' }} />
                                  </div>
                                )
                                : null
                            }
                          </div>
                        </div>
                      )
                  ))
                }
              </div>
            )
            : null}

          <div className="down-icon-recipents">
            {customerListVisible
              ? <ArrowDropDownIcon onClick={() => { showSelectCustomers(); }} />
              : <ArrowRightIcon onClick={() => { showSelectCustomers(); }} />}

            <div className="select-lists">Select Customers</div>
          </div>
          {customerListVisible ? renderCustomerList() : null}

        </div>
        <div className="send-to" onClick={() => { selectedCustomers(); }}>
          send to
        </div>
        <div className="selcted-recipients-list">
          {
            customerListVisible
              ? selectCustomers && selectCustomers.map((item, index) => (
                renderSelectedCustomerList(item, index)
              ))
              : selectListItemSelected && selectListItemSelected.map(
                (item, index) => (
                  renderSelectedSelectLists(item, index)
                )
              )
          }
        </div>
      </div>

      <div className="exclude">
        <Checkbox
          icon={<CircleUnchecked style={{ fill: 'rgba(0, 0, 0, 0.4)' }} />}
          checkedIcon={<CircleCheckedFilled style={{ fill: '#367C2C' }} />}
          checked={isChecked}
          onChange={handleChange}
        />
        <div className="exclude-text">Exclude Do Not Contact</div>
      </div>

      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Next</span>
        </Button>
      </div>

    </div>
  );
};

SelectRecipients.propTypes = {
  apiResponse: PropTypes.arrayOf(PropTypes.object),
  apiCustomerResponse: PropTypes.arrayOf(PropTypes.object),
  getData: PropTypes.func,
  isSaveDraft: PropTypes.bool,
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

SelectRecipients.defaultProps = {
  apiResponse: [],
  apiCustomerResponse: [],
  getData: () => { },
  isSaveDraft: false,
  campaignFormData: {},
};

export default SelectRecipients;
