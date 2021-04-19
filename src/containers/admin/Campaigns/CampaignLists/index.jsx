/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Box,
  TextField,
  makeStyles,
  withStyles,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Button,
  List,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Collapse,
  IconButton,
  Switch,
  ListItem as MuiListItem,
  Typography,
} from "@material-ui/core";
import { debounce } from "lodash";
import {
  ExpandMore,
  ExpandLess,
  ArrowRight,
  Add,
  AccountCircle,
  ArrowForwardIos,
  ArrowBack,
  Apps,
} from "@material-ui/icons";
import { Modal, ModalBody } from "reactstrap";
import CustomDropdown from "../../../../components/common/CustomDropdown";
import SearchInput from "../../../../components/common/SearchInput";
import { LISTTYPE, ServiceList } from "../../../../constants";
import Info from "../../../../assets/Icons/Header/Icon/Info.svg";
import Warning from "../../../../assets/Icons/Warning.svg";
import "./index.scss";
import ListsFilters from "../../../../components/ListsFilters";
import AccountFilters from "../../../../components/AccountFilters";
import LeadsFilters from "../../../../components/LeadsFilters";
import { FILTERS, API_MARKETING } from "../../../../constants";
import { toast } from "react-toastify";
import Loader from 'react-loader-spinner';

const useStyles = makeStyles((theme) => ({
  "@global": {
    body: {
      userSelect: "none",
    },
  },
  column: {
    width: "20%",
  },
  table: {
    width: "96%",
  },
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: "black",
    backgroundColor: "#EDEFF2",
  },
  button: {
    margin: theme.spacing(1),
    height: 34,
    fontFamily: "Inter",
    fontSize: 13,
    fontWeight: 600,
    textTransform: "none",
    background: '#0000'
  },
  addbutton: {
    width: 300,
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "none",
    justifyContent: "space-between",
    paddingLeft: "30px",
  },
  list: {
    width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
}));

const ListItem = withStyles({
  root: {
    "&$selected": {
      backgroundColor: "#d3d3d3",
      color: "white",
    },
  },
  selected: {},
})(MuiListItem);

const CampaignMessages = () => {
  const classes = useStyles();
  const history = useHistory();
  const [change, setChange] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedcustomers, setSelectedCustomers] = useState([]);
  const [customerapiResponse, setCustomerApiResponse] = useState([]);
  const [subMenuListsApiResponse, setSubMenuListsApiResponse] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [listapiResponse, setListApiResponse] = useState([]);
  const [filterUsersLists, setFilterUsersLists] = useState([]);
  const [state, setState] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [subopen, setSubOpen] = React.useState(false);
  const [subCustomeropen, setSubCustomeropen] = React.useState(false);
  const [isShareSubModal, setIsShareSubModal] = useState(false);
  const [isShareCustomerModal, setIsShareCustomerModal] = useState(false);
  const [isServiceModal, setisServiceModal] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [listmodal, setListModal] = useState(false);
  const togglelist = () => setListModal(!listmodal);
  const [listname, setlistname] = React.useState("");
  const [dropdownvalue, setdropdownvalue] = React.useState('7');
  const [isShowAccountModal, setIsShowAccountModal] = useState(false);
  const [isShowLeadsModal, setIsShowLeadsModal] = useState(false);
  const [serviceModelDays, setserviceModelDays] = useState('');
  const [load, setload] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    sortBy: "updatedAt",
    order: "DESC",
    filters: {
      manufacturer: [],
      modelYear: [],
      price: [],
      category: [],
    },
  });

  const [accountfilters, setAccountFilters] = useState({
    page: 1,
    sortBy: "updatedAt",
    order: "DESC",
    accountfilters: {
      state: [],
      city: [],
      assignee: [],
      tagproducts: []
    },
  });

  const [leadfilters, setLeadFilters] = useState({
    page: 1,
    sortBy: "id",
    order: "DESC",
    leadfilters: {
      state: [],
      city: [],
      assignee: [],
    },
  });

  const onApplyFilters = (selectedFilters) => {
    setFilters({
      ...filters,
      page: 1,
      filters: selectedFilters,
    });
  };

  const onFilterCancel = () => {
    setFilters({
      ...filters,
      filters: {
        ...filters.filters,
        manufacturer: [],
        modelYear: [],
        price: [],
        category: []
      },
    });
  };

  const onApplyAccountFilters = (selectedFilters) => {
    setAccountFilters({
      ...accountfilters,
      page: 1,
      accountfilters: selectedFilters,
    });
  };

  const onAccountFilterCancel = () => {
    setAccountFilters({
      ...accountfilters,
      accountfilters: {
        ...accountfilters.accountfilters,
        manufacturer: [],
        modelYear: [],
        price: [],
        category: []
      },
    });
  };

  const onApplyLeadFilters = (selectedFilters) => {
    setLeadFilters({
      ...leadfilters,
      page: 1,
      leadfilters: selectedFilters,
    });
  };

  const onLeadFilterCancel = () => {
    setLeadFilters({
      ...leadfilters,
      leadfilters: {
        ...leadfilters.leadfilters,
        manufacturer: [],
        modelYear: [],
        price: [],
        category: [],
        is_new: [],
        model: [],
      },
    });
  };

  const [checkstate, setCheckState] = React.useState({
    checkedA: false,
    checkedB: false,
  });

  const handleButtonChange = (value) => {
    setSelectedCustomers([...selectedcustomers, value]);
    setCustomerApiResponse(
      customerapiResponse.filter((item) => item.name !== value.name)
    );
  };

  const handleRemoveButtonChange = (value) => {
    setCustomerApiResponse([...customerapiResponse, value]);
    setSelectedCustomers(
      selectedcustomers.filter((item) => item.name !== value.name)
    );
  };

  const handleButtonClose = () => {
  };

  const handleCheckChange = (event) => {
    setCheckState({ ...checkstate, [event.target.name]: event.target.checked });
  };

  const customerTAGS = [
    {
      "id": "1",
      "name": "2019"
    },
    {
      "id": "2",
      "name": "Agriculture"
    },
    {
      "id": "3",
      "name": "Certified"
    },
    {
      "id": "4",
      "name": "Used"
    },
    {
      "id": "5",
      "name": "CaseIH"
    },
    {
      "id": "6",
      "name": "Combine"
    }
  ];
  const listTableDataApi = (id) => {
    setload(true);
    setFilterUsersLists([]);
    setListApiResponse([]);
    axios
      .get(`${API_MARKETING}/list/execute?id=` + id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`,
        },
      })
      .then((response) => {
        setload(false);
        if (response.status === 200) {
          setFilterUsersLists(response.data.searchList);
          setListApiResponse(response.data.searchList);
        }
      });
  };

  const listCustomerDataApi = () => {
    setCustomerApiResponse(customerTAGS);
  };

  const listSubMenuApi = () => {
    axios
      .get(`${API_MARKETING}/lists/list?page=1&limit=1000`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`,
        },
      })
      .then((response) => setSubMenuListsApiResponse(response.data.searchList));
  };

  useEffect(() => {
    listTableDataApi(1);
    listCustomerDataApi();
    listSubMenuApi();
  }, []);

  const showCampaign = () => {
    history.goBack();
  };

  const addList = () => {
    setState(!state);
    closeModal();
  };

  const handleListItemClick = (item, index) => {
    setSelectedIndex(index);
    setState(false);
    closeModal();
    listTableDataApi(item.id);
  };

  const closeModal = () => {
    setIsShareSubModal(false);
    setSubOpen(false);
    setIsShareCustomerModal(false);
    setSubCustomeropen(false);
    setOpen(false);
    setIsShowAccountModal(false);
    setIsShowLeadsModal(false);
    setisServiceModal(false);
  };

  const handleClick = () => {
    setOpen(!open);
    if (open) {
      setIsShareCustomerModal(false);
      setSubCustomeropen(false);
      setIsShareSubModal(false);
      setSubOpen(false);
      setIsShowAccountModal(false);
      setIsShowLeadsModal(false);
      setisServiceModal(false);
    }
  };

  const handlesubClick = () => {
    setSubOpen(!subopen);
    setIsShareSubModal(!isShareSubModal);
    setIsShareCustomerModal(false);
    setSubCustomeropen(false);
    setIsShowAccountModal(false);
    setIsShowLeadsModal(false);
    setisServiceModal(false);
  };

  const handleAccountClick = () => {
    setIsShowAccountModal(!isShowAccountModal);
    setSubOpen(false);
    setIsShareSubModal(false);
    setIsShareCustomerModal(false);
    setSubCustomeropen(false);
    setIsShowLeadsModal(false);
    setisServiceModal(false);
  };

  const handleLeadsClick = () => {
    setIsShowLeadsModal(!isShowLeadsModal);
    setSubOpen(false);
    setIsShareSubModal(false);
    setIsShareCustomerModal(false);
    setSubCustomeropen(false);
    setIsShowAccountModal(false);
    setisServiceModal(false);
  };

  const handleCustomerChange = () => {
    setSubCustomeropen(!subCustomeropen);
    setIsShareCustomerModal(!isShareCustomerModal);
    setIsShareSubModal(false);
    setSubOpen(false);
    setIsShowAccountModal(false);
    setIsShowLeadsModal(false);
    setisServiceModal(false);
  };

  const handleServiceModal = () => {
    setisServiceModal(!isServiceModal);
    setSubCustomeropen(false);
    setIsShareCustomerModal(false);
    setIsShareSubModal(false);
    setSubOpen(false);
    setIsShowAccountModal(false);
    setIsShowLeadsModal(false);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    if (val.length > 0) {
      const newData = filterUsersLists.filter(
        (item) => item.firstName.toLowerCase().indexOf(val.toLowerCase()) >= 0
          || item.lastName.toLowerCase().indexOf(val.toLowerCase()) >= 0
      );
      setChange(!change);
      setListApiResponse(newData);
    } else {
      setListApiResponse(filterUsersLists);
    }
  };

  const addNewRole = () => {
    const sampleValue = {
      name: listname,
      isDynamicList: checkstate.checkedB,
      updateAt: Number(dropdownvalue),
      accounts: {
        states: accountfilters.accountfilters.state,
        cities: accountfilters.accountfilters.city,
        salesRep: accountfilters.accountfilters.assignee,
        productTags: accountfilters.accountfilters.tagproducts
      },
    };
    axios
      .post(`${API_MARKETING}/list/create`, sampleValue, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`,
        },
      })
      .then((res) => {
        if (res.statusCode === 400) {
          toast.error(res.message);
        } else {
          toast.success('List added succesdfully');
          listSubMenuApi();
          onLeadFilterCancel();
          onFilterCancel();
          onAccountFilterCancel();
          setdropdownvalue('7');
          setlistname('');
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleNameChange = (event) => {
    setlistname(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setdropdownvalue(event.slice(0, 2).trim());
  };
  const handleServiceDropdownChange = (event) => {
    setserviceModelDays(event);
  }
  return (
    <div style={{ height: 'auto', backgroundColor: '#ffffff' }}>
      <div className="list-card flex justify-between w-100 h-100">
        <div style={{ flexDirection: "column", margin: 10, marginBottom: -14 }}>
          <div style={{ height: 50 }}>
            <Box display="flex" flexDirection="row" p={1}>
              <Box p={1} flexGrow={1} flexDirection="column">
                <div className="main-title">Lists</div>
                <div className="sub-main-title">
                  Create and manage dynamic lists of leads and customers.
              </div>
              </Box>
              <Box p={1} backgroundColor="red">
                <SearchInput
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onClear={() => handleSearchChange("")}
                  value={search}
                />
              </Box>
              <Button
                variant="contained"
                className={classes.button}
                size="small"
                startIcon={<Apps />}
                onClick={showCampaign}
              >
                Back to Campaigns
            </Button>
            </Box>
          </div>

          <div className="list-sub-menu">
            <Box display="flex" flexDirection="row" p={1}>
              <Box flexGrow={1} flexDirection="row">
                <Button
                  variant="text"
                  color="default"
                  size="large"
                  disableTouchRipple="true"
                  disablePadding="true"
                  className={classes.addbutton}
                  onClick={addList}
                  endIcon={
                    <IconButton autoFocus disabled color="primary">
                      {state ? (
                        <ArrowBack style={{ fontSize: 14 }} />
                      ) : (
                        <Add style={{ fontSize: 14 }} />
                      )}
                    </IconButton>
                  }
                >
                  {state ? "Back to list" : "Create a new list"}
                </Button>
              </Box>
              <div className="list-update-text">Updates every</div>
              <CustomDropdown
                className="list-dropdown"
                data={LISTTYPE}
                value="All"
                placeholder="7 Days"
              />
              <img onClick={toggle} className="pending_icon" src={Info} alt="" />
            </Box>
          </div>
        </div>
        <div className="container">
          <div className="left-side-list-wrapper">
            <Divider />
            <span className="list-title">My Lists</span>

            <div className="left-sub-wrapper">
              <List dense component="nav" aria-label="main mailbox folders">
                {subMenuListsApiResponse.map((item, index) => (
                  <div>
                    <Divider />
                    <ListItem
                      button
                      selected={selectedIndex === index}
                      onClick={() => handleListItemClick(item, index)}
                    >
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            style={{
                              fontFamily: "Inter",
                              fontStyle: "normal",
                              color: "black",
                              fontWeight: "550",
                              fontSize: 12,
                              lineHeight: 2,
                            }}
                          >
                            {item.name}
                          </Typography>
                        }
                      />
                      {item.is_dynamic === true ? (
                        <img className="warning_icon" src={Warning} alt="" />
                      ) : null}
                      <ListItemSecondaryAction
                        className={classes.listItemSecondaryAction}
                      >
                        {selectedIndex === index ? (
                          <ArrowForwardIos style={{ fontSize: 12 }} />
                        ) : (
                          ""
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  </div>
                ))}
              </List>
            </div>
          </div>

          <div className="right-side-list-wrapper">
            {state === false && (
              <div className="list-table-group">
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        style={{ height: 40, backgroundColor: "#F2F2F2" }}
                        className="table-response-header"
                      >
                        <TableCell
                          style={{
                            fontFamily: "Inter",
                            fontStyle: "normal",
                            color: "black",
                            fontWeight: "600",
                            fontSize: 14,
                          }}
                        >
                          {" "}
                      Customer{" "}
                        </TableCell>
                        <TableCell
                          style={{
                            fontFamily: "Inter",
                            fontStyle: "normal",
                            color: "black",
                            fontWeight: "600",
                            fontSize: 14,
                          }}
                        >
                          Product
                    </TableCell>
                        <TableCell
                          style={{
                            fontFamily: "Inter",
                            fontStyle: "normal",
                            color: "black",
                            fontWeight: "600",
                            fontSize: 14,
                          }}
                        >
                          Sold on
                    </TableCell>
                        <TableCell
                          style={{
                            fontFamily: "Inter",
                            fontStyle: "normal",
                            color: "black",
                            fontWeight: "600",
                            fontSize: 14,
                          }}
                        >
                          Service Due In
                    </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody style={{ backgroundColor: "white" }}>
                      {load ? <Loader
                        type="Oval"
                        color="#008080"
                        height={30}
                        width={30}
                        className="LoaderSpinner"
                      /> : null}
                      {listapiResponse.map((item) => (
                        <TableRow style={{ height: 40 }} key={item.firstName}>
                          <TableCell
                            scope="row"
                            style={{
                              fontFamily: "Inter",
                              fontStyle: "normal",
                              color: "black",
                              fontWeight: "600",
                              fontSize: 14,
                            }}
                          >
                            <AccountCircle
                              color="disabled"
                              style={{ fontSize: 18, margin: 2 }}
                            />{" "}
                            {item.firstName + " " + item.lastName}
                          </TableCell>
                          <TableCell
                            style={{
                              fontFamily: "Inter",
                              fontStyle: "normal",
                              color: "black",
                              fontWeight: "600",
                              fontSize: 14,
                            }}
                          >
                            {item.product_machine}
                          </TableCell>
                          <TableCell
                            style={{
                              fontFamily: "Inter",
                              fontStyle: "normal",
                              color: "black",
                              fontWeight: "600",
                              fontSize: 14,
                            }}
                          >
                            {item.created_at}
                          </TableCell>
                          <TableCell
                            style={{
                              fontFamily: "Inter",
                              fontStyle: "normal",
                              color: "black",
                              fontWeight: "600",
                              fontSize: 14,
                            }}
                          >
                            {item.due_date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
            {state === true && (
              <div className="new-list">
                <List disablePadding disableTypography>
                  <ListItem button disableTypography>
                    <ListItemIcon>
                      <ArrowRight style={{ fontSize: 20, color: "black" }} />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          type="body2"
                          style={{
                            marginLeft: -20,
                            color: "#000",
                            fontWeight: "bold",
                            fontFamily: "Inter",
                            fontSize: 14,
                            lineHeight: 2,
                          }}
                        >
                          Presets
                    </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem button onClick={handleClick} disableTypography>
                    <ListItemIcon>
                      <ArrowRight style={{ fontSize: 20, color: "black" }} />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          type="body2"
                          style={{
                            marginLeft: -20,
                            color: "#000",
                            fontWeight: "bold",
                            fontFamily: "Inter",
                            fontSize: 14,
                            lineHeight: 2,
                          }}
                        >
                          Custom
                    </Typography>
                      }
                    />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" dense style={{ paddingLeft: 30 }}>
                      <ListItem onClick={handleLeadsClick}>
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography
                              style={{
                                fontFamily: "Inter",
                                fontStyle: "normal",
                                color: "#000",
                                fontWeight: "600",
                                fontSize: 14,
                                lineHeight: 2,
                              }}
                            >
                              Leads
                        </Typography>
                          }
                        />
                        {isShowLeadsModal ? (
                          <ArrowForwardIos style={{ fontSize: 12 }} />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItem>
                      <Divider />
                      <ListItem onClick={handleAccountClick}>
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography
                              style={{
                                fontFamily: "Inter",
                                fontStyle: "normal",
                                color: "#000",
                                fontWeight: "600",
                                fontSize: 14,
                                lineHeight: 2,
                              }}
                            >
                              Accounts
                        </Typography>
                          }
                        />
                        {isShowAccountModal ? (
                          <ArrowForwardIos style={{ fontSize: 12 }} />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItem>
                      <Divider />
                      <ListItem onClick={handlesubClick}>
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography
                              style={{
                                fontFamily: "Inter",
                                fontStyle: "normal",
                                color: "#000",
                                fontWeight: "600",
                                fontSize: 14,
                                lineHeight: 2,
                              }}
                            >
                              Purchase History
                        </Typography>
                          }
                        />
                        {subopen ? (
                          <ArrowForwardIos style={{ fontSize: 12 }} />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItem>
                      <Divider />
                      <Collapse in={subopen} timeout="auto" unmountOnExit>
                        <List component="div" dense style={{ padding: 10 }}>
                          <div className="list-update-text">Make</div>
                          {filters.filters.manufacturer.map((item) => (
                            <Button
                              onClick={handleButtonClose}
                              disableTypography="true"
                              variant="contained"
                              style={{
                                margin: 3,
                                lineHeight: "14px",
                                fontFamily: "Inter",
                                fontWeight: 500,
                                fontSize: 12,
                                display: "inline-block",
                                padding: 4,
                                minHeight: "15px",
                                minWidth: 0,
                              }}
                            >
                              {item}
                            </Button>
                          ))}

                          <div className="list-update-text">Purchase Date</div>
                          {filters.filters.modelYear.map((item) => (
                            <Button
                              onClick={handleButtonClose}
                              disableTypography="true"
                              variant="contained"
                              style={{
                                margin: 3,
                                lineHeight: "14px",
                                fontFamily: "Inter",
                                fontWeight: 500,
                                fontSize: 12,
                                display: "inline-block",
                                padding: 4,
                                minHeight: "15px",
                                minWidth: 0,
                              }}
                            >
                              {item}
                            </Button>
                          ))}
                        </List>
                      </Collapse>

                      <ListItem onClick={handleCustomerChange}>
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography
                              style={{
                                fontFamily: "Inter",
                                fontStyle: "normal",
                                color: "#000",
                                fontWeight: "600",
                                fontSize: 14,
                                lineHeight: 2,
                              }}
                            >
                              Customer Tags
                        </Typography>
                          }
                        />
                        {subCustomeropen ? (
                          <ArrowForwardIos style={{ fontSize: 12 }} />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItem>
                      <Divider />

                      <Collapse in={subCustomeropen} timeout="auto" unmountOnExit>
                        <div className={classes.root}>
                          {selectedcustomers.map((item) => (
                            <Button
                              onClick={() => handleRemoveButtonChange(item)}
                              disableTypography="true"
                              variant="contained"
                              style={{
                                margin: 3,
                                lineHeight: "14px",
                                fontFamily: "Inter",
                                fontWeight: 500,
                                fontSize: 12,
                                display: "inline-block",
                                padding: 5,
                                minHeight: "15px",
                                minWidth: 0,
                              }}
                            >
                              {`${item.name} X `}
                            </Button>
                          ))}
                        </div>
                      </Collapse>

                      <ListItem onClick={handleServiceModal}>
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography
                              style={{
                                fontFamily: "Inter",
                                fontStyle: "normal",
                                color: "#000",
                                fontWeight: "600",
                                fontSize: 14,
                                lineHeight: 2,
                              }}
                            >
                              Service
                        </Typography>
                          }
                        />
                        <ExpandMore />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography
                                style={{
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  color: "#000",
                                  fontWeight: "600",
                                  fontSize: 14,
                                  lineHeight: 2,
                                }}
                              >
                                Dynamic List
                          </Typography>
                            }
                          />
                          <img
                            onClick={togglelist}
                            className="pending_icon"
                            src={Info}
                            alt=""
                          />
                        </div>

                        <Switch
                          flexGrow={2}
                          checked={checkstate.checkedB}
                          onChange={handleCheckChange}
                          name="checkedB"
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemText
                          disableTypography
                          primary={
                            <Typography
                              style={{
                                fontFamily: "Inter",
                                fontStyle: "normal",
                                color: "#000",
                                fontWeight: "600",
                                fontSize: 14,
                                lineHeight: 2,
                              }}
                            >
                              Updates every
                        </Typography>
                          }
                        />
                        <CustomDropdown
                          className="list-dropdown"
                          data={LISTTYPE}
                          value="All"
                          placeholder="7 Days"
                          onChange={handleDropdownChange}
                        />
                      </ListItem>

                      <TextField
                        dense
                        type="Name your list"
                        variant="outlined"
                        margin="dense"
                        placeholder="Name your list"
                        value={listname}
                        onChange={handleNameChange}
                      />
                      <button
                        type="button"
                        className="list-create-button"
                        onClick={addNewRole}
                      >
                        Create
                  </button>
                    </List>
                  </Collapse>
                </List>
              </div>
            )}

            {isShareSubModal === true && (
              <ListsFilters
                setFilters={isShareSubModal}
                onApplyFilters={onApplyFilters}
                defaultFilters={filters.filters}
                onFilterCancel={onFilterCancel}
                applied={false}
                activeTab={0}
              />
            )}

            {isShowAccountModal === true && (
              <AccountFilters
                setFilters={isShowAccountModal}
                onApplyFilters={onApplyAccountFilters}
                defaultFilters={accountfilters.accountfilters}
                onFilterCancel={onAccountFilterCancel}
                applied={false}
                activeTab={0}
              />
            )}
            {isShowLeadsModal === true && (
              <LeadsFilters
                setFilters={isShowLeadsModal}
                onApplyFilters={onApplyLeadFilters}
                defaultFilters={leadfilters.leadfilters}
                onFilterCancel={onLeadFilterCancel}
                applied={false}
                activeTab={0}
              />
            )}
            {isShareCustomerModal === true && (
              <div className="new-sub-list-customer">
                <div className="search-box align-center">
                  <SearchInput
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onClear={() => handleSearchChange("")}
                  />
                </div>

                <div className="list-update-text">Suggested :</div>

                <div className={classes.root}>
                  {customerapiResponse.map((item) => (
                    <Button
                      onClick={() => handleButtonChange(item)}
                      disableTypography="true"
                      variant="contained"
                      style={{
                        margin: 3,
                        lineHeight: "14px",
                        fontFamily: "Inter",
                        fontWeight: 500,
                        fontSize: 12,
                        display: "inline-block",
                        padding: 4,
                        minHeight: "15px",
                        minWidth: 0,
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {isServiceModal === true && (
              <div className="new-sub-list-service">
                <div className="list-update-text">Service due in the next :  <CustomDropdown
                  className="list-dropdown"
                  data={ServiceList}
                  value="All"
                  placeholder="Select"
                  onChange={handleServiceDropdownChange}
                /></div>
                <input type="button"
                  onClick={handleButtonClose}
                  className="service-list-back-btn"
                  value="Apply"></input>
              </div>
            )}
          </div>
        </div>
        <Modal isOpen={modal} toggle={toggle} className="custom-modal-style">
          <ModalBody
            style={{
              fontWeight: 200,
              fontSize: 12,
            }}
          >
            Created 09/30/2020
          <br />
          Dynamic List
          <br />
          Service due: TRUE
          <br />
          Days: ALL
        </ModalBody>
        </Modal>

        <Modal
          isOpen={listmodal}
          toggle={togglelist}
          className="custom-list-modal-style"
        >
          <ModalBody
            style={{
              color: "white",
              fontWeight: 200,
              fontSize: 12,
            }}
          >
            List will be periodically
          <br />
          updated based on
          <br />
          system changes
        </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default CampaignMessages;
