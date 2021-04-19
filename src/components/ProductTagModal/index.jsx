import React, { useEffect, useState } from 'react';
import {
  Modal,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { Divider, IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';

import './index.scss';
import SearchInput from '../common/SearchInput';
import CustomIcon from '../common/CustomIcon';
import {
  getMyCustomers,
  getProductTags,
  createTag,
  removeTag
} from '../../api';
import Loader from '../common/Loader';
import SearchItem from '../common/SearchItem';
import {
  createProductTagSuccess,
  clearMyCustomers,
  removeProductTagSuccess
} from '../../redux/actions';
import ProfileInitial from '../common/ProfileInitials';
import getFullName from '../../utils/getFullName';
import Button from '../common/Button';

const ProductTagModal = ({
  isOpen,
  toggle,
  product
}) => {
  const { myCustomers } = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const [customerFilters, setCustomerFilters] = useState({
    search: '',
    page: 1
  });
  const [taggedCustomerArray, setTaggedCustomerArray] = useState([]);
  const { taggedCustomers } = useSelector((state) => state.products);

  useEffect(() => {
    if (!myCustomers.data.length && isOpen) {
      dispatch(getMyCustomers({ ...customerFilters, page: 1 }));
    }
    if (isOpen) {
      dispatch(getProductTags(product.id));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getMyCustomers(customerFilters));
    }
  }, [customerFilters]);

  useEffect(() => {
    let newTaggedCustomerArray = [];
    Object.keys(taggedCustomers.data).forEach((key) => {
      newTaggedCustomerArray = [
        ...newTaggedCustomerArray,
        ...taggedCustomers.data[key]
      ];
    });
    setTaggedCustomerArray(newTaggedCustomerArray);
  }, [taggedCustomers]);

  const loadMoreCustomers = () => {
    setCustomerFilters({
      ...customerFilters,
      page: customerFilters.page + 1,
    });
  };

  const createTagHandler = (customer) => {
    dispatch(createProductTagSuccess({ customer }));
    dispatch(createTag({
      productId: product.id,
      customerId: customer.id
    }));
  };

  const removeTagHandler = (tag) => {
    dispatch(removeTag(tag, {
      customerId: tag.customer.id,
      productId: product.id
    })).then(() => {
      dispatch(removeProductTagSuccess(tag));
    });
  };

  const isSelected = (customer) => taggedCustomerArray
    .find((cus) => cus.customer.id === customer.id);

  const onSearch = debounce((text) => {
    dispatch(clearMyCustomers());
    setCustomerFilters({
      search: text,
      page: 1
    });
  }, 500);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className="product-tag-modal"
    >
      <div className="flex h-full">
        <div className="product-tag-modal__side product-tag-modal__side-left">
          <h3 className="h3-heading">Tag customer to product</h3>
          <SearchInput
            onChange={(e) => onSearch(e.target.value)}
            onClear={() => onSearch('')}
          />
          <InfiniteScroll
            next={loadMoreCustomers}
            hasMore={myCustomers.hasMore}
            loader={<Loader secondary />}
            dataLength={myCustomers.data.length}
            height="430px"
          >
            {myCustomers.data.map((customer) => (
              <SearchItem
                item={customer}
                onClick={() => {
                  if (isSelected(customer)) {
                    return;
                  }
                  createTagHandler(customer);
                }}
                icon={isSelected(customer) ? 'Tick' : 'Add'}
              />
            ))}
            { !myCustomers.data.length && !myCustomers.loading && (
              <center>
                No customers found!
              </center>
            ) }
          </InfiniteScroll>
        </div>
        <Divider orientation="vertical" />
        <div className="product-tag-modal__side product-tag-modal__side-right">
          <div className="flex items-center justify-between">
            <h1 className="h1-heading">Tagged customers</h1>
            <IconButton size="small" onClick={toggle}>
              <CustomIcon icon="Close" />
            </IconButton>
          </div>
          <div style={{ height: '450px' }}>
            {taggedCustomers.loading && (
              <div className="flex">
                <Loader secondary />
              </div>
            )}
            {!taggedCustomers.loading
            && !taggedCustomerArray.length
            && <center>No tagged customers!</center>}
            {!taggedCustomers.loading
            && taggedCustomerArray.map((tag) => (
              <div className="flex justify-between items-center tagged-item">
                <div className="flex">
                  <ProfileInitial
                    {...tag.customer}
                    profileId={tag.customer.id}
                    size="small"
                  />
                  <span className="ml-2">{getFullName(tag.customer)}</span>
                </div>
                <UncontrolledDropdown className="moreOptionsCon">
                  <DropdownToggle>
                    <IconButton
                      size="small"
                    >
                      <CustomIcon icon="more-vertical" />
                    </IconButton>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => removeTagHandler(tag)}
                    >
                      Remove tag
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={toggle} className="self-end">Done Tagging</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

ProductTagModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  product: PropTypes.objectOf(PropTypes)
};

ProductTagModal.defaultProps = {
  product: {}
};

export default ProductTagModal;
