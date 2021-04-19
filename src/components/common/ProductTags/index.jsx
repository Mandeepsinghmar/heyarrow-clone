/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from 'react-loader-spinner';
import TableContent from '../ContentsTable';
import { getAdminProductTags, deleteAdminProducteTag } from '../../../api/adminProducts';
import './index.scss';

const columns = [
  { label: 'First name', key: 'firstName', hasInitials: true },
  { label: 'Last name', key: 'lastName' },
  {
    label: 'Email address',
    key: 'email',
  },
  {
    label: 'Phone number',
    key: 'phone',
  },
  { label: 'State', key: 'state' },
  { label: 'City', key: 'city' },
  { label: 'Tagged by', key: 'taggedBy', hasInitials: true },
  { label: 'Tagged on', key: 'createdOn' },
];
const adminProductTagsList = (props) => {
  const [productTagLists, setProductTagList] = useState([]);

  const { adminProductTags, match } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    const productTagsHash = adminProductTags || [];

    const productTags = Object.keys(productTagsHash)
      .reduce((result, dateKey) => result.concat(adminProductTags[dateKey]), [])
      .map((product) => ({
        id: `${product?.id}`,
        customerid: `${product?.customer?.id}`,
        productId: `${product?.product?.id}`,
        firstName: `${product?.customer?.firstName}`,
        lastName: product?.customer?.lastName,
        email: product?.customer?.email,
        phone: product?.customer?.phone,
        state: product?.customer?.city?.state?.name,
        city: product?.customer?.city?.name,
        createdOn: product?.createdOn,
        taggedBy: `${product?.customer?.firstName} ${product?.customer?.lastName}`,
      }));

    setProductTagList(productTags);
  }, [adminProductTags]);

  useEffect(() => {
    dispatch(getAdminProductTags(match));
  }, []);
  const loader = (
    <div className="tableLoading ShowTableLoader" key={0}>
      <Loader type="Oval" color="#008080" height={30} width={30} />
    </div>
  );
  const onSave = () => {};

  const removeTagHandler = (tag) => {
    dispatch(deleteAdminProducteTag(tag, {
      customerId: tag.customerId,
      productId: tag.productId
    })).then((id) => {
      const productTagsStates = productTagLists.filter((productTag) => (
        productTag.id !== id
      ));
      setProductTagList(productTagsStates);
    });
  };

  return (
    <div className="innerFullCon">
      <div className="tableBox">
        <InfiniteScroll
          pageStart={1}
          hasMore={!adminProductTags}
          loader={loader}
          threshold={150}
          useWindow={false}
          initialLoad={false}
        >
          <TableContent
            columns={columns}
            data={productTagLists || []}
            hasVerticalScroll
            ProductActivity
            readOnly
            onSave={onSave}
            removeRow={removeTagHandler}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

adminProductTagsList.propTypes = {
  adminProductTags: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  adminProductTags: state.adminProduct.adminProductTags,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(adminProductTagsList);
