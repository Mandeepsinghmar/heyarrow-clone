import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import InfiniteScroll from 'react-infinite-scroll-component';
import CampaignCustomerDropDown from '../../../components/common/CampaignCustomerDropDown';
import CampaignFolderDropDown from '../../../components/common/CampaignFolderDropDown';
import { FILTERS, API_MARKETING } from '../../../constants';
import CustomIcon from '../../../components/common/CustomIcon';
import Group from '../../../assets/Icons/Header/Icon/Group.svg';
import AddIcon from '../../../assets/Icons/plus-icon.png';
import CreateTag from './CreateFolder';
import CampaignMedia from './CampaignMedia';

const CampaignsAll = (props) => {
  const { CampaignData } = props;
  const [apiResponse, setApiResponse] = useState(CampaignData);
  const [folderResponse, setFolderApiResponse] = useState({});
  const [openModal, setopenModal] = useState(false);
  const [search, setSearch] = useState('');
  const [pinned, setPinned] = useState('');
  const [filterOpen, setfilterOpen] = useState(true);
  const [folderOpen, setFolderOpen] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    filters: {
      campaignType: [],
      most: '',
      isdraft: '',
      folder: ''
    }
  });
  const MakeApiUrl = (pageNum, key, Most, Search, Isdraft, Ispin, Folder) => {
    let Url = `${API_MARKETING}/list?page=${pageNum}&limit=10`;
    if (key !== '') { Url = `${Url}&type=${key}`; }
    if (Most !== '') { Url = `${Url}&mostRecent=${Most}`; }
    if (Search !== '') { Url = `${Url}&searchText=${Search}`; }
    if (Isdraft !== '' && Isdraft !== false) { Url = `${Url}&isDraft=true`; }
    if (Ispin !== '') { Url = `${Url}&isPin=true`; }
    if (Folder !== '') { Url = `${Url}&folderId=${Folder}`; }
    return Url;
  };
  const CallSearchApi = (key, Most, Search, Isdraft, Ispin, Folder) => {
    const Url = MakeApiUrl('1', key, Most, Search, Isdraft, Ispin, Folder);
    axios
      .get(Url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setApiResponse(response.data.campaignList);
        }
      });
  };
  const CallFolderApi = () => {
    axios
      .get(`${API_MARKETING}/tags?page=1&limit=20`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((response) => setFolderApiResponse(response.data.result));
  };
  const history = useHistory();
  useEffect(() => {
    CallFolderApi();
  }, []);
  const addNew = () => {
    history.push('/admin/campaigns/new');
  };
  const PinHandler = () => {
    const Url = MakeApiUrl('1', '', '', '', '', true, '');
    axios
      .get(Url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          setApiResponse([]);
          setApiResponse(response.data.campaignList);
        }
        setPinned(true);
        setFilters({
          page: 1,
          filters: {
            ...filters.filters,
            campaignType: []
          }
        });
        setSearch('');
      });
  };
  const onSearchOK = debounce((cam, most, isdraft, folder) => {
    CallSearchApi(cam, most, '', isdraft, '', folder);
  }, 500);
  const SearchFilterData = (searchType, Most, isDraft, Folder) => {
    if (searchType.length > 0) {
      onSearchOK(searchType.toString(), Most, '', '');
      setFilters({
        page: 1,
        filters: {
          ...filters.filters,
          campaignType: searchType
        }
      });
    } else if (Most !== '') {
      onSearchOK('', Most, '', '');
      setFilters({
        page: 1,
        filters: {
          ...filters.filters,
          most: Most
        }
      });
    } else if (isDraft !== '') {
      onSearchOK(filters.filters.campaignType.length > 0 ? filters.filters.campaignType : '', '', isDraft, '');
      setFilters({
        page: 1,
        filters: {
          ...filters.filters,
          isdraft: isDraft
        }
      });
    } else if (Folder !== '') {
      onSearchOK('', '', '', Folder);
      setFilters({
        page: 1,
        filters: {
          ...filters.filters,
          folder: Folder
        }
      });
    } else {
      onSearchOK('', '', '', '');
      setFilters({
        page: 1,
        filters: {
          ...filters.filters,
          campaignType: []
        }
      });
    }
  };
  const ResetFilters = () => {
    props.Apicall();
  };
  const handleCampaignPin = (Id, IsPin) => {
    axios
      .post(`${API_MARKETING}/pin`, { campaignId: Id, isPin: IsPin }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          if (IsPin) {
            toast.success('Your compaign pinned succesfully.');
          } else {
            toast.success('Your compaign unpinned succesfully.');
          }
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const HandleSearch = () => {
    setFilters({
      page: 1,
      filters: {
        ...filters.filters
      }
    });
  };
  const handleCampaignArchived = (Id) => {
    axios
      .post(`${API_MARKETING}/archived`, { campaignId: Id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then(() => {
        if (Id) {
          toast.success('Campaign archived successfully');
          onSearchOK('', '', '', '');
          HandleSearch();
        } else {
          toast.error('Campaign archived unsuccessfull');
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleCampaignDupliate = (Id) => {
    axios
      .post(`${API_MARKETING}/duplicate`, { campaignId: Id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success('Campaign duplicate successfully');
          onSearchOK('', '', '', '');
          HandleSearch();
        } else {
          toast.error('Campaign duplicate unsuccessfull');
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const onSearch = debounce((text) => {
    CallSearchApi('', '', text, '', '', '');
  }, 500);
  const searchHandler = (searchText) => {
    onSearch(searchText);
    setSearch(searchText);
    HandleSearch();
  };
  const fetchMoreData = () => {
    const campType = filters.filters.campaignType.length > 0 ? filters.filters.campaignType.toString() : '';
    const Url = MakeApiUrl(filters.page + 1, campType, filters.filters.most, search, filters.filters.isdraft === true ? true : '', pinned === true ? true : '', filters.filters.folder);
    setTimeout(() => {
      axios
        .get(Url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('bearToken')}`
          }
        })
        .then((response) => setApiResponse(
          apiResponse.concat(response.data.campaignList)
        ));
    }, 1000);
    setFilters({
      ...filters,
      page: filters.page + 1
    });
  };
  const ApplyFilterOpen = (e) => {
    setfilterOpen(e);
  };
  const CheckFolderOpen = (e) => {
    setFolderOpen(e);
  };
  const showLists = () => {
    history.push('/admin/campaigns/campaignList');
  };
  return (
    <>
      <div className="campaign__header">
        <span className="campaign__text__header">Campaigns</span>
        <div className="campaign__subheader">
          <span className="campaign__text__subheader">
            Create and manage your marketing campaigns
          </span>
        </div>
      </div>
      <div className="topActionBar">
        <div className="searchTabs">
          {search ? (
            <CustomIcon
              icon="clear"
              onClick={() => {
                onSearch('');
                setSearch('');
                HandleSearch();
              }}
            />
          )
            : <CustomIcon icon="Search" />}
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={search}
            onChange={(e) => searchHandler(e.target.value)}
          />
          <span className="createBtn " onClick={addNew}>
            Create
            <CustomIcon className="createBtnIcon" icon="Header/Icon/Add" />
          </span>
          <span className="listsBtn" onClick={showLists}>
            Lists
            <img className="groupBtnIcon" src={Group} alt="group" />
          </span>
        </div>
      </div>
      <div className="campaign__filters">
        <div className="campaignleftSideBar">
          <span className="pinned-label" onClick={() => PinHandler()}>Pinned Campaign</span>
          <div className="campaign__filters__left" style={{ height: filterOpen ? 420 : 40 }}>
            {filterOpen ? <ArrowDropDownIcon className="arrow-cls" /> : <ArrowRightIcon className="arrow-cls" />}
            <CampaignCustomerDropDown
              data={FILTERS}
              defaultFilters={filters.filters}
              value={<CustomIcon icon="Header/Icon/Add" />}
              placeholder="Filters"
              className="campaign-filter-item"
              SearchFilterData={SearchFilterData}
              ResetFilters={ResetFilters}
              ApplyFilterOpen={ApplyFilterOpen}
            />
          </div>
          <div className="folder">
            <div className="campaign__folder__filters__left">
              {folderOpen > 0 ? <ArrowDropDownIcon className="arrow-cls" /> : <ArrowRightIcon className="arrow-cls" />}
              <>
                <CampaignFolderDropDown
                  SearchFilterData={SearchFilterData}
                  data={folderResponse}
                  value="Folders"
                  placeholder="Folders"
                  className="campaign-filter-item"
                  CheckFolderOpen={CheckFolderOpen}
                />
                <img src={AddIcon} alt="folder" onClick={() => setopenModal(true)} className="create-tag" />
                {openModal ? <CreateTag isOpen={openModal} setopenModal={setopenModal} CallFolderApi={CallFolderApi} /> : ''}
              </>
            </div>
          </div>
        </div>
        <div className="campaignrightSideBar">
          <InfiniteScroll
            dataLength={apiResponse.length > 0 ? apiResponse.length : 10}
            next={() => fetchMoreData()}
            hasMore
            loader
          >
            <Grid
              container
              spacing={2}
              alignItems="flex-end"
              justify={apiResponse.length > 0 ? '' : 'center'}
            >
              {apiResponse.length > 0 ? apiResponse.map((campaignProps) => (
                <CampaignMedia
                  {...campaignProps}
                  handleCampaignPin={handleCampaignPin}
                  handleCampaignArchived={handleCampaignArchived}
                  handleCampaignDupliate={handleCampaignDupliate}
                />
              )) : 'No campaigns available'}
            </Grid>
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};
CampaignsAll.propTypes = {
  Apicall: PropTypes.func.isRequired,
  CampaignData: PropTypes.arrayOf.isRequired
};
export default CampaignsAll;
