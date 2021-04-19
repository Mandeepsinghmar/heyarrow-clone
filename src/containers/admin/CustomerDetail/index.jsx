/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import Loader from 'react-loader-spinner';

import SideDrawer from '../../../components/cards/SideDrawer';
import CustomIcon from '../../../components/common/CustomIcon';
import TableContent from '../../../components/common/ContentsTable';
import { nFormatter } from '../../../utils/formatMessageDate';
import {
  getCustomerOverview,
  getCustomersDealMode,
  getCustomersProductDetails,
  getCustomerNotes,
  getTagsProductList,
} from "../../../api/adminCustomers";
import "./index.scss";
import SideTabsComponent from "../../../components/common/SideTabsComponent";
import HeaderDropDown from "../../../components/common/HeaderDropDown";
import ProfileInitial from "../../../components/common/ProfileInitials";
import DealModeDrawer from "../DealModeDrawer";
import Notes from "../../../components/Notes";
import Interest from "../../../components/Interest";
import { DEAL_MODE_STATUSES, DOMAIN } from "../../../constants";
import { SwipeableDrawer } from "@material-ui/core";

const columns = [
  { label: "Date", key: "created_at", type: "date" },
  { label: "Machine", key: "machine" },
  { label: "Category", key: "category" },
  { label: "Type", key: "type", type: "type" },
  { label: "Price", key: "amount", type: "price" },
  { label: "Team Members", key: "teamMember", type: "team_member" },
];

const columnsQuoted = [
  { label: "Date", key: "created_at", type: "date" },
  { label: "Machine", key: "machine" },
  { label: "Category", key: "category" },
  { label: "Type", key: "type", type: "type" },
  { label: "Price", key: "quoteValue", type: "price" },
  { label: "Team Members", key: "teamMember", type: "team_member" },
];

const columnsShared = [
  { label: "Date", key: "created_at", type: "date" },
  { label: "Machine", key: "machine" },
  { label: "Category", key: "category" },
  { label: "Make", key: "make" },
  { label: "Model", key: "modelName" },
  { label: "Year", key: "modelYear" },
  { label: "Type", key: "type", type: "type" },
  { label: "Cost", key: "cost" },
  { label: "Price", key: "price", type: "price" },
  { label: "Margin", key: "price", type: "price" },
  { label: "Via", key: "via" },
  { label: "Team Members", key: "teamMember", type: "team_member" },
];

const columnsDeal = [
  { label: "Created on", key: "created_at", type: "date" },
  { label: "Deal Name", key: "machine" },
  { label: "New Assets", key: "newAssets" },
  { label: "New Assets Value", key: "newAssetsValue", type: "price" },
  { label: "Trade In", key: "tradeIn" },
  { label: "Trade Value", key: "tradeInValue", type: "price" },
  { label: "Net Margin", key: "netMargin", type: "price" },
  { label: "Net Margin %", key: "netMarginPercentage" },
  { label: "Status", key: "status" },
  { label: "Assign to", key: "teamMember", type: "team_member" },
];

const columnsTags = [
  { label: "Machine", key: "machine" },
  { label: "Category", key: "category" },
  { label: "Price", key: "price", type: "price" },
  { label: "Year", key: "modelYear" },
  { label: "Make", key: "make" },
  { label: "Cost", key: "cost" },
  { label: "Model", key: "modelName" },
  { label: "Type", key: "type" },
  { label: "Tagged by", key: "teamMember", type: "team_member" },
];

const bottomTabs = [
  "Shared",
  "Quoted",
  "Sold",
  "Closed",
  "Deal Mode",
  "Notes",
  "Tag Products",
];
const durationTabs = ["Month", "Quarter", "Year"];
const selectType = ["All Type", "New", "Used"];
const currentYear = new Date().getFullYear();

const handleStatus = (status) => {
  switch (status) {
    case "shared":
      return 0;
    case "quoted":
      return 1;
    case "sold":
      return 2;
    case "closed":
      return 3;
    case "tag_products":
      return 4;
    case "notes":
      return 5;
    case "interest":
      return 6;
    default:
      0;
      break;
  }
};

const defaultTabs = [
  {
    label: "Notes",
    value: "notes",
    subtitle: "-",
  },
  {
    label: "Interest",
    value: "interest",
    subtitle: "-",
  },
];

const dealModeDomains = ["arrow", "sketchish", "heyarrow", "cbops"];

function CustomerDetail(props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const history = useHistory();

  const { status } = queryString.parse(location.search);

  const [activeTab, setActiveTab] = useState(2);
  let customerId = useParams()?.customerId;
  const [activeStateTab, setActiveStateTab] = useState(handleStatus(status));
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(status !== 'notes' && status !== 'interest' ? true : false);
  const [customerDetailList, setCustomerDetailList] = useState([]);
  const [customerDealsList, setCustomerDealsList] = useState([]);
  const [tagProductList, setTagProductList] = useState();
  const [openDealModeDrawer, setOpenDealModeDrawer] = useState(false);
  const [dealToShow, setDealToShow] = useState();
  const [openQuoteDrawer, setOpenQuoteDrawer] = useState(false);
  const [quoteToShow, setQuoteToShow] = useState();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: status || 'shared',
    duration: 'all',
    durationType: 'yearly',
    search: '',
  });

  const {
    dispatch,
    adminCustomerDetail,
    adminCustomerSide,
    adminCustomertags,
  } = props;

  useEffect(() => {
    getCustomerData(filters);
  }, [filters.status, filters.page]);

  useEffect(() => {
    dispatch(
      getCustomerNotes({
        customerId,
      })
    );
  }, [customerId]);

  useEffect(() => {
    dispatch(getCustomerOverview(customerId));
  }, []);

  useEffect(() => {}, [adminCustomerDetail]);

  useEffect(() => {
    const productTagList = adminCustomertags ? adminCustomertags : [];
    const productTagListArray = Object.keys(productTagList)
      .reduce((result, dateKey) => {
        return result.concat(productTagList[dateKey]);
      }, [])
      .map((product) => ({
        tagged_on: product.createdOn,
        id: product.id,
        category: product.product.category,
        machine: product.product.machine,
        modelName: product.product.modelName,
        modelYear: product.product.modelYear,
        make: product.product.manufacturer,
        price: product.product.price,
        type: product.type,
        teamMember: `${product?.customer?.firstName} ${product?.customer?.lastName}`,
      }));
    setTagProductList(productTagListArray);
  }, [adminCustomertags]);

  useEffect(() => {
  const productHashMap = (adminCustomerDetail && adminCustomerDetail.products) || {};
  const customerDetails = Object.keys(productHashMap)
        .reduce((result, dateKey) => {
          return result.concat(productHashMap[dateKey]);
        }, [])
        .map((product) => ({
          amount: product?.amount,
          created_at: product?.createdAt,
          id: product?.id,
          category: product?.product?.category,
          description: product?.product?.description,
          ProductId: product?.product?.id,
          machine: product?.product?.machine,
          manufacturer: product?.product?.manufacturer,
          model: product?.product?.model,
          modelName: product?.product?.modelName,
          modelYear: product?.product?.modelYear,
          price: product?.product?.price,
          productAssets: product?.product?.productAssets,
          serialNumber: product?.product?.serialNumber,
          stockNumber: product?.product?.stockNumber,
          type: product?.type,
          via: product?.type === 1 ? 'Text' : product?.type === 2 ? 'Email' : '-',
          teamMember: product?.salesRep ? `${product?.salesRep?.firstName} ${product?.salesRep?.lastName}` : '',
          quoteValue: product?.quoteValue
        })
      )
      setCustomerDetailList(customerDetails);
  }, [adminCustomerDetail]);

  useEffect(() => {
  const dealsHashMap = (adminCustomerDetail && adminCustomerDetail.deals) || {};

  const customerDeals = Object.keys((dealsHashMap)).reduce(
    (result, dateKey) => {
      return result.concat(dealsHashMap[dateKey])
    }, []
  ).map(
    deal => ({
      ...deal,
      id: deal.id,
      machine: deal.dealName,
      created_at: deal.createdAt,
      newAssets: deal.purchaseProducts.length,
      newAssetsValue: deal.purchaseProducts.reduce(
        (t, c) => t + c?.product?.price,
        0
      ),
      tradeIn: deal.tradeProducts.length,
      tradeInValue: deal.tradeProducts.reduce(
        (t, c) => t + c?.productSold?.amount,
        0
      ),
      netMargin: deal.currentMargin || 0,
      netMarginPercentage: deal.tradeMargin || '-',
      status: {
        value: DEAL_MODE_STATUSES.find((status) => status.value === deal?.state)
          ?.label,
        cellClass: deal?.state === 'in_progress' ? 'in_progress' : '',
      },
      teamMember: deal?.salesRep
        ? `${deal?.salesRep?.firstName} ${deal?.salesRep?.lastName}`
        : '',
    }));
    setCustomerDealsList(customerDeals);
    }, [adminCustomerDetail]);

  const onChangeTab = (currentTab) => {
    setActiveTab(currentTab);
    let durationType = "yearly";
    let defaultDuration = new Date().getFullYear();
    let value = parseInt(currentTab.target.value, 10);
    switch (value) {
      case 0:
        return {
          duration: "monthly",
          defaultDuration: "1",
        };
      case 1:
        return {
          duration: "quarterly",
          defaultDuration: "1",
        };
      case 2:
        return {
          duration: "yearly",
          defaultDuration: "all",
        };
      default:
        break;
    }
    return filterHandler({ durationType, duration: defaultDuration });
  };

  const onStateChangeTab = (status) => {
    filterHandler({ status: status, page: 1 });
    if (status !== 'notes' && status !== 'interest' ) {
      setHasMore(true)
      return;
    }
    setHasMore(false)
  };

  const onChangeUrl = (status) => {
    history.push(
      `/admin/customer-detail/${customerId}?status=${status
        .split(" ")
        .join("_")
        .toLowerCase()}`
    );
  };

  const onChangeDuration = (e) => {
    const { value } = e.target;
    filterHandler({ duration: value });
  };

  const searchHandler = (e) => {
    filterHandler({ page: 1 });
    filterHandler({ search: e.target.value });
  };

  const filterHandler = (items) => {
    const _filter = { ...filters, page: 1, ...items };
    setFilters(_filter);
  };

  const hashLength = (hash) => {
    const productHash = hash ? hash : [];
    const productHashListArray = Object.keys(productHash)
      .reduce((result, dateKey) => {
        return result.concat(hash[dateKey]);
      }, [])
      .map((product) => ({...product}));

      return productHashListArray.length;
  }

  const getCustomerData = (_filters) => {
    _filters.status !== 'notes' && _filters.status !== 'interest' ? setloading(true) : null;

    if (_filters.status === 'deal_mode') {
      dispatch(getCustomersDealMode(customerId, _filters)).then((data) => {
        if (data.deals.length < 10) {
          setHasMore(false)
        }
      }).finally(() => {
        setloading(false);
      });;

    }
    else if (_filters.status === 'tag_products') {
      dispatch(getTagsProductList(customerId, _filters)).then((data) => {
        if (hashLength(data) < 10) {
          setHasMore(false)
        }
      }).finally(() => {
        setloading(false);
      });;
    }
    else if (_filters.status === 'interest') {

      dispatch(
        getCustomersProductDetails(
          customerId,
          {..._filters,
            status: 'interests'
          }
        )
      ).then((data) => {
        if (data.interests < 10) {
          setHasMore(false)
        }
      }).finally(() => {

        setloading(false);
      });;
    }
    else if (_filters.status !== 'notes') {
      dispatch(getCustomersProductDetails(customerId, _filters))
      .then((data) => {
        if (hashLength(data.products) < 10) {
          setHasMore(false)
        }
      })
      .finally(() => {
        setloading(false);
      });
    }
  };

  const loadFunc = () => {
    if (!loading) {
      setFilters({
        ...filters,
        page: page + 1
      })

    }
  };

  const renderTableActions = (item) => (
    <div className="table-actions">
      <button
        className="sendBtn"
        onClick={() => {
          setOpenDealModeDrawer(true);
          setDealToShow(item);
        }}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );

  const openQuotedInfo = (item) => {
    setOpenQuoteDrawer(true);
    setQuoteToShow(item);
  };

  const productHashMap =
    (adminCustomerDetail && adminCustomerDetail.products) || {};
  const dealsHashMap = (adminCustomerDetail && adminCustomerDetail.deals) || {};

  const customerDetails = Object.keys(productHashMap)
    .reduce((result, dateKey) => {
      return result.concat(productHashMap[dateKey]);
    }, [])
    .map((product) => ({
      amount: product?.amount,
      created_at: product?.createdAt,
      id: product?.id,
      category: product?.product?.category,
      description: product?.product?.description,
      ProductId: product?.product?.id,
      machine: product?.product?.machine,
      manufacturer: product?.product?.manufacturer,
      model: product?.product?.model,
      modelName: product?.product?.modelName,
      modelYear: product?.product?.modelYear,
      price: product?.product?.price,
      productAssets: product?.product?.productAssets,
      serialNumber: product?.product?.serialNumber,
      stockNumber: product?.product?.stockNumber,
      type: product?.type,
      via: product?.type === 1 ? "Text" : product?.type === 2 ? "Email" : "-",
      teamMember: product?.salesRep
        ? `${product?.salesRep?.firstName} ${product?.salesRep?.lastName}`
        : "",
      quoteValue: product?.quoteValue,
    }));



  const customerDeals = Object.keys(dealsHashMap)
    .reduce((result, dateKey) => {
      return result.concat(dealsHashMap[dateKey]);
    }, [])
    .map((deal) => ({
      ...deal,
      id: deal.id,
      machine: deal.dealName,
      created_at: deal.createdAt,
      newAssets: deal.purchaseProducts.length,
      newAssetsValue: deal.purchaseProducts.reduce(
        (t, c) => t + c?.product?.price,
        0
      ),
      tradeIn: deal.tradeProducts.length,
      tradeInValue: deal.tradeProducts.reduce(
        (t, c) => t + c?.productSold?.amount,
        0
      ),
      netMargin: deal.currentMargin || 0,
      netMarginPercentage: deal.tradeMargin || "-",
      status: {
        value: DEAL_MODE_STATUSES.find((status) => status.value === deal?.state)
          ?.label,
        cellClass: deal?.state === "in_progress" ? "in_progress" : "",
      },
      teamMember: deal?.salesRep
        ? `${deal?.salesRep?.firstName} ${deal?.salesRep?.lastName}`
        : "",
    }));

  const handleTypeChange = (e) => {
    const { value } = e.target;
    if (value === "New") {
      setCustomerDetailList(
        customerDetails.filter((data) => data.modelYear >= currentYear)
      );
    } else if (value === "Used") {
      setCustomerDetailList(
        customerDetails.filter((data) => data.modelYear < currentYear)
      );
    } else {
      setCustomerDetailList(customerDetails);
    }
  };

  console.log(hasMore);

  return (
    <>
      <div className="contentContainerFull teamDescription customerDetails">
        <div className="innerFullCon leftSideBar">
          <div className="product-head-title customer-title-head">
            <Link to="/admin/customers">
              <i class="fa fa-angle-left" aria-hidden="true"></i>
            </Link>
            <h4>Customers</h4>
          </div>
          <div className="tableBox">
            <ul className="listCon timeLineContainer">
              <li className="listItem active">
                <div className="infoBox">
                  <div className="userCard">
                    <div style={{ position: "relative", zIndex: 9 }}>
                      <ProfileInitial
                        firstName={get(
                          adminCustomerSide.customer,
                          "firstName",
                          ""
                        )}
                        lastName={get(
                          adminCustomerSide.customer,
                          "lastName",
                          ""
                        )}
                        size="medium"
                        profileId={get(adminCustomerSide.customer, "id", "")}
                      />
                    </div>
                    {adminCustomerSide &&
                    adminCustomerSide.customer &&
                    adminCustomerSide.customer.salesRep ? (
                      <div style={{ position: "absolute", top: 0, left: 20 }}>
                        <ProfileInitial
                          firstName={get(
                            adminCustomerSide.customer.salesRep,
                            "firstName",
                            ""
                          )}
                          lastName={get(
                            adminCustomerSide.customer.salesRep,
                            "lastName",
                            ""
                          )}
                          size="medium"
                          profileId={get(
                            adminCustomerSide.customer.salesRep,
                            "id",
                            ""
                          )}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="userName">
                    <h4>
                      {`${get(
                        adminCustomerSide.customer,
                        "firstName",
                        ""
                      )} ${get(adminCustomerSide.customer, "lastName", "")}`}
                    </h4>
                    <p>{`${get(
                      adminCustomerSide.customer,
                      "city.name",
                      ""
                    )} ${get(
                      adminCustomerSide.customer,
                      "city.state.name",
                      ""
                    )}`}</p>
                    <ul className="userActions">
                      <li>
                        <a
                          href={`mailto:${get(
                            adminCustomerSide.customer,
                            "email",
                            ""
                          )}`}
                        >
                          <CustomIcon icon="Icon/Email" />
                        </a>
                      </li>
                      <li>
                        <Link
                          to={`/admin/chats/customers/${
                            adminCustomerSide.customer &&
                            adminCustomerSide.customer.id
                          }`}
                        >
                          <CustomIcon icon="Icon/Chat Regular" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
            <div className="cardHeader noborder">
              <div className="bottomTabs">
                <SideTabsComponent
                  onChangeUrl={onChangeUrl}
                  activeTab={activeStateTab}
                  tabs={[
                    ...Object.keys(adminCustomerSide?.counts)
                      ?.filter(
                        (key) =>
                          key !== "customers" &&
                          key !== "team" &&
                          (dealModeDomains.includes(DOMAIN) ||
                            key !== "deal_mode")
                      )
                      .map((key) => ({
                        label: key.replace("_", " "),
                        value: key,
                        subtitle: adminCustomerSide?.counts[key]?.total,
                      })),
                    ...defaultTabs,
                  ]}
                  noRightSection
                  onChangeTab={onStateChangeTab}
                  value={filters.status}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="innerFullCon rightSection">
          {filters.status !== "notes" && filters.status !== "interest" && (
            <div className="cardHeader noborder">
              <div className="topActionBar" style={{ right: 5 }}>
                {filters.status !== "deal_mode" ? (
                  <div className="bottomTabs">
                    <div className="selecBox" style={{ margin: 0 }}>
                      <select
                        className="form-control"
                        onChange={handleTypeChange}
                      >
                        {selectType.map((item) => (
                          <option style={{ fontSize: "15px" }}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <HeaderDropDown
                      activeTab={activeTab}
                      tabs={durationTabs}
                      renderSelect
                      renderSelectOnRight
                      onChangeTab={onChangeTab}
                      onChangeDuration={onChangeDuration}
                    />
                  </div>
                ) : null}

                {/* <div style={{ marginLeft: 10 }}>
                  <SideDrawer logs={adminCustomerDetail.logs} />
                </div> */}
              </div>
            </div>
          )}

          {filters.status !== "notes" && filters.status !== "interest" ? (
            <div
              className="detailCards overviewCards"
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              <div className="cardBox">
                <div className="innerCardCon gray">
                  <h4>REVENUE</h4>
                  <h3>
                    {(adminCustomerDetail.salesData &&
                      `$${nFormatter(adminCustomerDetail.salesData.volume)}`) ||
                      "$0"}
                  </h3>
                </div>
              </div>
              <div className="cardBox">
                <div className="innerCardCon gray">
                  <h4>AVG. TURN</h4>
                  <h3>
                    {(adminCustomerDetail.salesData &&
                      `${nFormatter(
                        adminCustomerDetail.salesData.avgTurn == "-"
                          ? 0
                          : adminCustomerDetail.salesData.avgTurn
                      )}D`) ||
                      "0D"}
                  </h3>
                </div>
              </div>
              <div className="cardBox">
                <div className="innerCardCon gray">
                  <h4>UNITS</h4>
                  <h3>
                    {(adminCustomerDetail.salesData &&
                      `${nFormatter(adminCustomerDetail.salesData.units)}`) ||
                      "0"}
                  </h3>
                </div>
              </div>
              <div className="cardBox">
                <div className="innerCardCon gray">
                  <h4>EST. MARGIN</h4>
                  <h3>
                    {(adminCustomerDetail.salesData &&
                      `$${nFormatter(
                        adminCustomerDetail.salesData.estMargin == "-"
                          ? 0
                          : adminCustomerDetail.salesData.estMargin
                      )}`) ||
                      "$0"}
                  </h3>
                </div>
              </div>
            </div>
          ) : null}
          <div className="customerDetails__table">
            <InfiniteScroll
              pageStart={filters.page}
              loadMore={loadFunc}
              hasMore={hasMore}
              loader={(
               <div className="tableLoading ShowTableLoader" key={0}>
                 <Loader
                    type="Oval"
                    color="#008080"
                    height={30}
                    width={30}
                  />
                </div>
              )}
              threshold={150}
              useWindow={false}
              initialLoad={false}
            >
              {filters.status !== 'notes' && filters.status !== 'interest' ? (
                <TableContent
                  columns={
                    filters.status === "shared"
                      ? columnsShared
                      : filters.status === "deal_mode"
                      ? columnsDeal
                      : filters.status === "quoted"
                      ? columnsQuoted
                      : filters.status === "tag_products"
                      ? columnsTags
                      : columns
                  }
                  loading={loading}
                  data={
                    (filters.status === "deal_mode"
                      ? customerDealsList
                      : filters.status === "tag_products"
                      ? tagProductList
                      : customerDetailList) || []
                  }
                  readOnly
                  tag_product={filters.status === "tag_products"}
                  quoted={filters.status === "quoted"}
                  tableActions={
                    filters.status === "tag_products"
                      ? "tag_products"
                      : filters.status === "quoted"
                      ? "quoted"
                      : renderTableActions
                  }
                  noActions={
                    filters.status === "deal_mode" ||
                    filters.status === "tag_products" ||
                    filters.status === "quoted"
                  }
                  emptyMessage={filters.status}
                  openQuotedInfo={openQuotedInfo}
                />
              ) : filters.status === "notes" ? (
                <Notes fromCustomersDetails={true} />
              ) : (
                <Interest
                  roles="admin"
                  interests={{
                    ...adminCustomerDetail,
                    data: adminCustomerDetail.interests,
                    loading: loading,
                  }}
                />
              )}
            </InfiniteScroll>
          </div>
        </div>
        <DealModeDrawer
          isOpen={openDealModeDrawer}
          onClose={() => setOpenDealModeDrawer(false)}
          dealId={dealToShow?.id}
          deal={dealToShow}
        />
        <SwipeableDrawer
          anchor={"right"}
          open={openQuoteDrawer}
          onClose={() => setOpenQuoteDrawer(false)}
        >
          <div style={{ width: "500px", padding: "10px" }}>
            <div style={{display:'flex',justifyContent:'flex-end',padding:'15px'}}>
              <button
                className="status"
                type="button"
                onClick={() => setOpenQuoteDrawer(false)}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div style={{padding:'10px',border:'1px solid #eee',borderRadius:'3px',display:'flex'}}>
              <div>
                <img src={quoteToShow?.productAssets[0]?.url} alt='product' height='150px' width='150px' />
              </div>
              <div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'8px'}}>
                  <b>2020 NyutyRe TM34HG</b>
                  <b style={{marginLeft:'50px'}}> $1,39,898</b>
                </div>
                <div style={{padding:'8px'}}>
                  <p>#THZ43G sdfgdjg fgfghgh fghgjhj gfgjhj</p>
                  <p>#new #2020</p>
                </div>
              </div>
            </div>
            <div style={{padding:'15px',display:'flex',justifyContent:'space-between'}}>
                  <div>
                    <p>Listed Price(18%)</p>
                    <p>Quote Price(10%)</p>
                    <p>Shiping Cost</p>
                    <p>Discounts</p>
                    <p>Taxes</p>
                    <p>Other Fees</p>
                    <p>Selling Price(4.85%)</p>
                  </div>
                  <div>
                    <p style={{textAlign:'right'}}>$ 1,00,000</p>
                    <p style={{textAlign:'right'}}>$ 1,10,000</p>
                    <p style={{textAlign:'right'}}>$ 1,000</p>
                    <p style={{textAlign:'right'}}>$ 500</p>
                    <p style={{textAlign:'right'}}>$ 5,525</p>
                    <p style={{textAlign:'right'}}>$ 0</p>
                    <p style={{textAlign:'right'}}>$ 1,16,025</p>
                  </div>
            </div>
            <hr />
          </div>
        </SwipeableDrawer>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  adminCustomerDetail: state.adminCustomer.adminCustomerDetail,
  adminCustomerSide: state.adminCustomer.adminCustomerSide,
  adminCustomertags: state.adminCustomer.taggedProducts,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);
