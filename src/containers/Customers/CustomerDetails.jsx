import React, { useEffect, useState } from 'react';
import { Divider, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';

import './index.scss';
import CustomAccordion from '../../components/common/Collapsable';
import PinnedCustomers from '../../components/PinnedCustomers';
import { customers } from '../../_mocks_';
import MyCustomers from '../../components/MyCustomers';
import TabWithContent from '../../components/common/TabWithContent';
import CustomIcon from '../../components/common/CustomIcon';
import TabPanel from '../../components/common/TabPanel';
import UnassignedCustomers from '../../components/UnassignedCustomers';
import ProfileGroup from '../../components/common/ProfileGroup';
import StatsCard from '../../components/common/StatsCard';
import CustomDropdown from '../../components/common/CustomDropdown';
import {
  DURATION_TYPES,
  DURATION_OPTIONS,
  TYPES,
  DOMAIN
} from '../../constants';
import AddCustomerModal from '../../components/AddCustomerModal';
import CreateQuotedModal from '../../components/CreateQuotedModal';
import VerticalTabs from '../../components/common/VerticalTabs';
import getFullName from '../../utils/getFullName';
import {
  getCustomerStats,
  getCustomerChatMessages,
  postMessage,
  getCustomerOverview,
  getCustomerNotes,
  getDeals,
  getCustomerTags,
  removeTag,
  getCustomerInterest,
  sendAttachment
} from '../../api';
import Loader from '../../components/common/Loader';
import getLocation from '../../utils/getLocation';
import Button from '../../components/common/Button';
import ProductItem from './ProductItem';
import LeftSideWrapper from '../../components/common/LeftSideWrapper';
import RightSideWrapper from '../../components/common/RightSideWrapper';
import MessageList from '../../components/MessageList';
import ShareProductChatModal from '../../components/ShareProductChatModal';
import EditCustomerModal from '../../components/EditCustomerModal';
import {
  canCreateCustomers,
  canUpdateCustomers,
  canShareProducts,
  canViewUnassignedCustomers
} from '../../utils/checkPermission';
import QuotePreviewModal from '../QuotePreview/Modal';
import DealMode from '../../components/DealMode';
import Notes from '../../components/Notes';
import Interest from '../../components/Interest';
import DealModal from '../../components/DealMode/Modal';
import {
  removeCustomerTagSuccess,
  postMessageSuccess
} from '../../redux/actions';
import MentionInput from '../../components/common/MentionTextBox';
import InputAttachment from '../../components/common/InputAttachment';

const defaultTabs = [
  {
    label: 'Notes',
    value: 'notes',
    subtitle: '-'
  },
  {
    label: 'Interest',
    value: 'interest',
    subtitle: '-'
  }
];

const dealModeDomains = ['arrow', 'sketchish', 'heyarrow', 'cbops'];

const Customers = ({
  location
}) => {
  const [currentTab, setcurrentTab] = useState(0);
  const [message, setMessage] = useState('');
  const [isAddCustomerModal, setIsAddCustomerModal] = useState(false);
  const [isCreateQuotedModal, setIsCreateQuotedModal] = useState(false);
  const [isShareProductChatModal, setIsShareProductChatModal] = useState(false);
  const [isEditCustomerModal, setIsEditCustomerModal] = useState(false);
  const [isQuotePreviewModal, setIsQuotePreviewModal] = useState(false);
  const [isDealModal, setDealModal] = useState(false);
  const history = useHistory();
  const [salesData, setSalesData] = useState({});
  const [files, setFiles] = useState([]);
  const [fileValue, setFileValue] = useState('');

  const dispatch = useDispatch();
  const { status } = queryString.parse(location.search);

  const [filters, setFilters] = useState({
    durationType: 'yearly',
    duration: 'all',
    status: status || 'shared',
    type: 'all'
  });
  const { customerId } = useParams();
  const {
    customerStats,
    customerOverview,
    taggedProducts,
    interests
  } = useSelector((state) => state.customers);
  const {
    deals
  } = useSelector((state) => state.dealMode);
  const { currentUser } = useSelector((state) => state.auth);
  const [duration, setDuration] = useState(DURATION_OPTIONS[DURATION_TYPES
    .findIndex((dr) => dr.value === filters.durationType)]);

  const toggleAddCustomerModal = () => {
    setIsAddCustomerModal(!isAddCustomerModal);
  };

  const toggleIsCreateQuotedModal = () => {
    setIsCreateQuotedModal(!isCreateQuotedModal);
  };

  const toggleIsShareProductChatModal = () => {
    setIsShareProductChatModal(!isShareProductChatModal);
  };

  const toggleIsEditCustomerModal = () => {
    setIsEditCustomerModal(!isEditCustomerModal);
  };

  const toggleisQuotePreviewModal = () => {
    setIsQuotePreviewModal(!isQuotePreviewModal);
  };

  const toggleDealModal = () => {
    setDealModal(!isDealModal);
  };

  useEffect(() => {
    if (customerOverview.customer?.id !== customerId) {
      dispatch(getCustomerChatMessages(customerId));
      dispatch(getCustomerOverview(customerId));
    }
  }, [customerId]);

  useEffect(() => {
    if (filters.status === 'deal_mode') {
      dispatch(getDeals(customerId));
    } else if (filters.status === 'interest') {
      dispatch(getCustomerInterest(customerId));
    } else if (filters.status === 'tag_products') {
      dispatch(getCustomerTags(customerId));
    } else if (filters.status !== 'notes') {
      dispatch(getCustomerStats(customerId, filters));
    }
  }, [filters, customerId]);

  useEffect(() => {
    if (status && status !== filters.status) {
      setFilters({
        ...filters,
        status,
      });
    }
  }, [status]);

  useEffect(() => {
    const newDuration = DURATION_OPTIONS[DURATION_TYPES
      .findIndex((dr) => dr.value === filters.durationType)];
    setDuration(newDuration);
  }, [filters.durationType]);

  useEffect(() => {
    if (filters.status === 'notes') {
      dispatch(getCustomerNotes({
        customerId
      }));
    }
  }, [customerId, filters]);

  useEffect(() => {
    if (filters.status === 'deal_mode') {
      setSalesData(deals.salesData);
    } else {
      setSalesData(customerStats.salesData);
    }
  }, [customerStats, deals]);

  const onFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const postMessageWithAttachment = () => {
    const body = new FormData();
    dispatch(postMessageSuccess({
      fromUserId: currentUser.id,
      fromUser: currentUser,
      toCustomer: customerId,
      message,
      chatAssets: files.map(({ file, url }) => ({
        fileType: file.type,
        url,
        name: file.name,
        size: file.size,
      })),
      created_at: new Date()
    }));
    body.append('attach', files[0].file);
    if (customerId) {
      body.append('toCustomer', customerId);
    }
    if (message) {
      body.append('message', message);
    }
    dispatch(sendAttachment(body));
    setFiles([]);
  };

  const postMessageHandler = (e) => {
    e.preventDefault();
    if (files.length) {
      postMessageWithAttachment();
    } else {
      const body = {
        toCustomer: customerId,
        message
      };
      const preMessage = {
        fromUserId: currentUser.id,
        fromUser: currentUser,
        message,
        toCustomerId: customerId,
        created_at: new Date()
      };
      dispatch(postMessage(body, preMessage));
    }
    setMessage('');
  };

  const removeTagHandler = (tag) => {
    dispatch(removeTag(tag), {
      customerId,
      productId: tag.product.id
    }).then(() => {
      dispatch(removeCustomerTagSuccess(tag));
    });
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      postMessageHandler(e);
    }
  };

  const emptyState = () => {
    switch (filters.status) {
    case 'shared': {
      return (
        <div className="empty-state">
          <img src="/images/Shared.svg" alt="sold" />
          <span>No Shared history</span>
        </div>
      );
    }
    case 'quoted': {
      return (
        <div className="empty-state">
          <img src="/images/Quoted.svg" alt="sold" />
          <span>No Quoted history</span>
        </div>
      );
    }
    case 'sold': {
      return (
        <div className="empty-state">
          <img src="/images/Sold.svg" alt="sold" />
          <span>No Sold history</span>
        </div>
      );
    }
    case 'closed': {
      return (
        <div className="empty-state">
          <img src="/images/Closed.svg" alt="sold" />
          <span>No Closed history</span>
        </div>
      );
    }
    default:
      return '';
    }
  };

  const onVerticalTabChange = (value) => {
    history.push({
      path: '',
      search: `?status=${value}`
    });
  };

  const onUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      const { result } = reader;
      setFiles([{ file: e.target.files[0], url: result }]);
    };
    reader.readAsDataURL(e.target.files[0]);
    setFileValue(e.target.value);
  };

  const removeFiles = (index) => {
    setFiles(files.filter((file, i) => index !== i));
    setFileValue('');
  };

  return (
    <div className="flex justify-between w-100 customer-details-container">
      <LeftSideWrapper>
        <div className="leftSidebarContent scroll-vertical">
          <CustomAccordion
            title="Pinned Customers"
            accordionId="pinned-customers"
          >
            <PinnedCustomers customers={customers} />
          </CustomAccordion>
          {canCreateCustomers()
          && (
            <div className="customers-add-btn">
              <CustomIcon icon="Add" onClick={toggleAddCustomerModal} />
            </div>
          )}
          <TabWithContent
            titles={['Assigned', 'Unassigned']}
            onChangeTab={(tab) => setcurrentTab(tab)}
          >
            <TabPanel index={0} value={currentTab}>
              <MyCustomers />
            </TabPanel>
            <TabPanel index={1} value={currentTab}>
              {canViewUnassignedCustomers()
                ? <UnassignedCustomers /> : <center className="text-sm">Not authorized</center>}
            </TabPanel>
          </TabWithContent>
        </div>
      </LeftSideWrapper>
      <div className="center-box customers-container">
        <div className="customers__left-sider">
          <Link to="/customers" className="customer_back-btn">
            <i className="fa fa-angle-left" />
            Overview
          </Link>
          {customerOverview.loading ? <Loader secondary />
            : (
              <div className="customers__left-sider__header">
                <div>
                  <div className="flex items-center">
                    <ProfileGroup
                      profiles={
                        [
                          customerOverview?.customer,
                          customerOverview?.customer?.salesRep
                        ]
                      }
                    />
                    {customerOverview.customer.requestedCallBack
                    && (
                      <div className="request-call-tag flex items-center ml-2">
                        Request a Call Back
                      </div>
                    )}
                  </div>
                  <div className="customers__header-title">
                    <span>{getFullName(customerOverview.customer)}</span>
                    <span>{getLocation(customerOverview?.customer?.city)}</span>
                  </div>
                </div>
                <div className="customers__header-icons">
                  <IconButton
                    size="small"
                  >
                    <a href={`mailto:${customerOverview.customer?.email}`}>
                      <CustomIcon icon="email" />
                    </a>
                  </IconButton>
                  <IconButton
                    size="small"
                  >
                    <a href={`/chats/customers/${customerOverview.customer?.id}`}>
                      <CustomIcon icon="chat" />
                    </a>
                  </IconButton>
                  {canUpdateCustomers()
                  && (
                    <IconButton
                      size="small"
                      onClick={toggleIsEditCustomerModal}
                    >
                      <CustomIcon icon="edit" />
                    </IconButton>
                  ) }
                </div>
              </div>
            )}
          {!customerOverview.loading
          && (
            <div className="customers__left-sider__body">
              <VerticalTabs
                tabs={[...Object
                  .keys(customerOverview?.counts)
                  ?.filter((key) => (key !== 'customers'
                  && key !== 'team')
                  && (dealModeDomains.includes(DOMAIN)
                  || key !== 'deal_mode'))
                  .map((key) => ({
                    label: key.replace('_', ' '),
                    value: key,
                    subtitle: customerOverview?.counts[key]?.total
                  })), ...defaultTabs]}
                value={filters.status}
                onChange={(value) => onVerticalTabChange(value)}
              />
            </div>
          ) }
        </div>
        <Divider orientation="vertical" />
        <div className="customers__right-sider">
          {filters.status === 'notes' && <Notes fromCustomersDetails={false} />}
          {filters.status === 'interest' && <Interest roles="salesRep" interests={interests} />}
          {filters.status === 'tag_products' && (
            <div className="mt-4">
              <div>
                <h3 className="h3-heading">Tag Products</h3>
              </div>
              {taggedProducts.loading && <Loader secondary />}
              {!Object.keys(taggedProducts.data)
                .filter((key) => taggedProducts.data[key].length > 0).length
                && !taggedProducts.loading && <center>No tags found!</center>}
              <div className="products-list">
                {Object.keys(taggedProducts.data)
                  .filter((key) => taggedProducts.data[key].length > 0)
                  .map(
                    (key) => (
                      <div className="product-list-group">
                        <h3>{key}</h3>
                        <Divider />
                        {taggedProducts.data[key]
                          .map((tag) => (
                            <ProductItem
                              sales={tag}
                              status={filters.status}
                              removeTag={() => removeTagHandler(tag)}
                            />
                          ))}
                      </div>
                    )
                  )}
              </div>
            </div>
          )}
          {filters.status !== 'notes'
          && filters.status !== 'interest'
          && filters.status !== 'tag_products'
          && (
            <>
              <div className="stats_card_list">
                <StatsCard
                  label="Revenue"
                  value={salesData.volume}
                  type="currency"
                />
                <StatsCard
                  label="AVG.TUrn"
                  value={salesData.avgTurn}
                  type="day"
                />
                <StatsCard
                  label="Units"
                  value={salesData.units}
                />
                <StatsCard
                  label="EST.MARGIN"
                  value={salesData.estMargin}
                  type="currency"
                />
              </div>
              <div className="customers__filters">
                <div className="customers__filters__left" />
                <div className="customers__filters__right">
                  <CustomDropdown
                    data={TYPES}
                    value={filters.type}
                    placeholder="Type"
                    onChange={(value) => onFilterChange('type', value)}
                  />
                  <CustomDropdown
                    data={duration?.data}
                    value={filters.duration}
                    placeholder={duration.placeholder}
                    onChange={(value) => onFilterChange('duration', value)}
                  />
                  <CustomDropdown
                    data={DURATION_TYPES}
                    value={filters.durationType}
                    placeholder="Duration type"
                    onChange={(value) => onFilterChange('durationType', value)}
                  />
                  {filters.status === 'shared' && canShareProducts() && (
                    <Button
                      onClick={toggleIsShareProductChatModal}
                      className="action-btn"
                    >
                      Share
                    </Button>
                  ) }
                  {filters.status === 'quoted' && (
                    <Button
                      onClick={toggleIsCreateQuotedModal}
                      className="action-btn"
                    >
                      Create
                    </Button>
                  )}
                  {filters.status === 'deal_mode' && (
                    <Button
                      className="action-btn"
                      onClick={toggleDealModal}
                    >
                      Create
                    </Button>
                  )}
                </div>
              </div>
              <div className="products-list">
                {filters.status !== 'deal_mode'
            && (
              <div>
                {customerStats.loading ? <Loader secondary />
                  : (
                    <>
                      {Array.isArray(customerStats.products) ? (
                        <>
                          {customerStats.products.map((sales) => (
                            <ProductItem
                              sales={sales}
                              status={filters.status}
                            />
                          ))}
                          {!customerStats.products.length
                    && emptyState()}
                        </>
                      )
                        : (
                          <div>
                            {Object.keys(customerStats.products).map(
                              (key) => (
                                <div className="product-list-group">
                                  <h3>{key}</h3>
                                  <Divider />
                                  {customerStats.products[key]
                                    .map((sales) => (
                                      <ProductItem
                                        sales={sales}
                                        status={filters.status}
                                      />
                                    ))}
                                </div>
                              )
                            )}
                            {!Object.keys(customerStats.products).length
                    && emptyState()}
                          </div>
                        )}
                    </>
                  )}
              </div>
            ) }
              </div>
              {filters.status === 'deal_mode' && <DealMode />}
            </>
          )}
        </div>
      </div>
      <RightSideWrapper>
        <div className="customer-message-container">
          <div className="customer-message-list">
            <MessageList />
          </div>
          <form>
            <input
              accept="image/svg+xml,image/x-png,image/jpeg,application/pdf,.csv"
              id="attach-"
              type="file"
              hidden
              value={fileValue}
              onChange={onUpload}
            />
            <div className="flex-1">
              <MentionInput
                value={message}
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
                singleLine={false}
                onKeyPress={onKeyPress}
              />
              {files.map(({ file, url }, index) => (
                <InputAttachment
                  key={url}
                  file={file}
                  url={url}
                  onClose={() => removeFiles(index)}
                />
              ))}
            </div>
            <label className="customer-attach-btn cursor-pointer" htmlFor="attach-">
              <CustomIcon icon="Icon/Attach" />
            </label>
            <IconButton
              onClick={postMessageHandler}
              type="submit"
              size="small"
              disabled={!message.length && !files.length}
            >
              <CustomIcon icon="Send-Enabled" />
            </IconButton>
          </form>
        </div>
      </RightSideWrapper>
      <AddCustomerModal
        isOpen={isAddCustomerModal}
        toggle={toggleAddCustomerModal}
      />
      <CreateQuotedModal
        isOpen={isCreateQuotedModal}
        toggle={toggleIsCreateQuotedModal}
        action={filters.status}
      />
      {canShareProducts()
      && (
        <ShareProductChatModal
          isOpen={isShareProductChatModal}
          toggle={toggleIsShareProductChatModal}
        />
      ) }
      {!customerOverview.loading
      && (
        <EditCustomerModal
          isOpen={isEditCustomerModal}
          toggle={toggleIsEditCustomerModal}
          customer={customerOverview.customer}
        />
      )}
      <QuotePreviewModal
        isOpen={isQuotePreviewModal}
        toggle={toggleisQuotePreviewModal}
        location={location}
      />
      <DealModal
        isOpen={isDealModal}
        toggle={toggleDealModal}
      />
    </div>
  );
};

Customers.propTypes = {
  location: PropTypes.objectOf(PropTypes.any)
};

Customers.defaultProps = {
  location: {}
};

export default Customers;
