import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  IconButton,
  SwipeableDrawer,
  Divider
} from '@material-ui/core';

import getProductImgUrl from '../../utils/getProductImageUrl';
import getProductName from '../../utils/getProductName';
import moneyFormatter from '../../utils/moneyFormatter';
import CustomIcon from '../../components/common/CustomIcon';
import MarkProductModal from '../../components/MarkProductModal';
import { formattedProductPrice } from '../../utils/getProductPrice';
import DealModal from '../../components/DealMode/Modal';
import calcPercentage from '../../utils/calCulatePercentage';

const ProductItem = ({
  sales,
  status,
  removeTag
}) => {
  const renderShareIcon = () => {
    switch (sales.type) {
    case 1:
      return <CustomIcon icon="chat" />;
    case 2:
      return <CustomIcon icon="email" />;
    default:
      return '';
    }
  };
  const [isMarkProductModal, setIsMarkProductModal] = useState(false);
  const [isDealModal, setisDealModal] = useState(false);
  const [isDrawer, setDrawer] = useState(false);

  const toggleMarkProductModal = () => {
    setIsMarkProductModal(!isMarkProductModal);
  };

  const toggleIsDealModal = () => {
    setisDealModal(!isDealModal);
  };

  const toggleDrawer = () => {
    setDrawer(!isDrawer);
  };

  const findPdf = (product) => product?.productAssets?.filter((asset) => asset.type === 'brochure' || asset.type === 'report');

  return (
    <div className="products-list__item">
      <div className="product-list-img">
        <img alt="" src={getProductImgUrl(sales.product, '/Icons/product-img-small.svg')} />
      </div>
      <div className="flex-1">
        <h3
          onClick={() => {
            if (status === 'quoted') {
              toggleDrawer();
            }
          }}
          className="flex justify-between cursor-pointer"
        >
          <span>{getProductName(sales.product)}</span>
          <span>{status === 'shared' || status === 'tag_products' ? formattedProductPrice(sales.product) : moneyFormatter.format(sales.quoteValue || sales.amount)}</span>
        </h3>
        <div className="flex justify-between items-start">
          <div>
            <span className="tag self-start">{sales.product?.category}</span>
            <div className="product-item__stats flex items-center">
              {(status === 'shared' || status === 'quoted')
              && (
                <>
                  <span className="product-item__stats-item">{`View: ${sales.views || 0}`}</span>
                  <span className="product-item__stats-item">{`Like: ${sales.likes || 0}`}</span>
                </>
              )}
              {sales.requestedCallback
              && (
                <div className="request-call-tag flex items-center">
                  Request a Call Back
                  <CustomIcon icon="close-white" />
                </div>
              )}
            </div>
          </div>
          {status === 'shared' && (
            <div className="flex">
              {renderShareIcon()}
              <UncontrolledDropdown className="moreOptionsCon">
                <DropdownToggle>
                  <IconButton
                    size="small"
                  >
                    <CustomIcon icon="more-vertical" />
                  </IconButton>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={toggleIsDealModal}>
                    Create Deal Mode
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          )}
          {status === 'quoted' && (
            <UncontrolledDropdown className="moreOptionsCon">
              <DropdownToggle>
                <IconButton
                  size="small"
                >
                  <CustomIcon icon="more-vertical" />
                </IconButton>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={toggleMarkProductModal}>
                  Mark as Sold
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {status === 'sold' && (
            <UncontrolledDropdown className="moreOptionsCon">
              <DropdownToggle>
                <IconButton
                  size="small"
                >
                  <CustomIcon icon="more-vertical" />
                </IconButton>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={toggleMarkProductModal}>
                  Mark as Close
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {status === 'tag_products' && (
            <UncontrolledDropdown className="moreOptionsCon">
              <DropdownToggle>
                <IconButton
                  size="small"
                >
                  <CustomIcon icon="more-vertical" />
                </IconButton>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => removeTag()}>
                  Remove tag
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
        </div>
      </div>
      <MarkProductModal
        isOpen={isMarkProductModal}
        toggle={toggleMarkProductModal}
        sales={sales}
        status={status === 'quoted' ? 'Sold' : 'Close'}
      />
      <DealModal
        isOpen={isDealModal}
        toggle={toggleIsDealModal}
      />
      <SwipeableDrawer
        anchor="right"
        open={isDrawer}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        BackdropProps={{ invisible: true }}
      >
        <div className="quote-details-drawer">
          <div className="flex justify-end">
            <IconButton
              size="small"
              onClick={toggleDrawer}
            >
              <CustomIcon icon="Close" />
            </IconButton>
          </div>
          <div className="products-list">
            <div className="products-list__item">
              <div className="product-list-img">
                <img alt="" src={getProductImgUrl(sales.product, '/Icons/product-img-small.svg')} />
              </div>
              <div className="flex-1">
                <h3 className="flex justify-between">
                  <span>{getProductName(sales.product)}</span>
                  <span>{status === 'shared' ? formattedProductPrice(sales.product) : moneyFormatter.format(sales.amount + (sales.shipping ? sales.shipping : 0))}</span>
                </h3>
              </div>
            </div>
            <div className="quote-detail-item">
              <span>Cost</span>
              <span>{sales?.product?.wholesalePrice === undefined ? '-' : moneyFormatter.format(sales.product.wholesalePrice)}</span>
            </div>
            <div className="quote-detail-item">
              <span>{`Listed Price(${calcPercentage(formattedProductPrice(sales.product), sales?.product?.wholesalePrice)}%)`}</span>
              <span>{formattedProductPrice(sales.product)}</span>
            </div>
            <div className="quote-detail-item">
              <span>{`Quoted Price(${calcPercentage(sales.amount, sales?.product?.wholesalePrice)}%)`}</span>
              <span>{moneyFormatter.format(sales?.amount)}</span>
            </div>
            <div className="quote-detail-item">
              <span>Shipping Cost</span>
              <span>{moneyFormatter.format(sales.shipping)}</span>
            </div>
            <div className="quote-detail-item">
              <span>Discounts</span>
              <span>{moneyFormatter.format(sales.discount)}</span>
            </div>
            <div className="quote-detail-item">
              <span>Taxes</span>
              <span>{moneyFormatter.format(sales.taxes)}</span>
            </div>
            <div className="quote-detail-item">
              <span>Other fees</span>
              <span>{moneyFormatter.format(sales.otherFees)}</span>
            </div>
            <div className="quote-detail-item total">
              <span>
                {`Selling Price(${calcPercentage(Number(sales.shipping)
                        + Number(sales.amount)
                        + Number(sales.taxes)
                        + Number(sales.otherFees)
                        - Number(sales.discount), sales?.product?.wholesalePrice)}%)`}
              </span>
              <span>
                {moneyFormatter
                  .format(Number(sales.shipping)
                        + Number(sales.amount)
                        + Number(sales.taxes)
                        + Number(sales.otherFees)
                        - Number(sales.discount))}
              </span>
            </div>
            {findPdf(sales.product) && !!findPdf(sales.product).length && (
              <>
                <h3 className="h3-heading">Document</h3>
                <Divider />
                <div div className="document-preview">
                  <embed
                    src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${findPdf(sales.product)[0].url}`}
                    type="application/pdf"
                    frameBorder="0"
                    scrolling="no"
                    width="100%"
                    height="100%"
                  />
                </div>
                <div className="flex column document-preview-details">
                  <span>#245253</span>
                  <span>Sent on 1/12/2021</span>
                </div>
              </>
            )}
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
};

ProductItem.propTypes = {
  sales: PropTypes.objectOf(PropTypes.any).isRequired,
  status: PropTypes.string,
  removeTag: PropTypes.func
};

ProductItem.defaultProps = {
  status: 'shared',
  removeTag: () => {}
};
export default ProductItem;
