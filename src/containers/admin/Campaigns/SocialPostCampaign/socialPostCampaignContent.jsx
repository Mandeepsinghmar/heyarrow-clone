import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import InstagramLogin from '../../../../components/SocialLogin/Instagram/Login';
import Facebook from '../../../../assets/Icons/Header/Icon/Facebook.png';
import Instagram from '../../../../assets/Icons/Header/Icon/Instagram.svg';
import Twitter from '../../../../assets/Icons/Header/Icon/Twitter.svg';
import LinkedInIcon from '../../../../assets/Icons/Header/Icon/LinkedIn.svg';
import SnapChat from '../../../../assets/Icons/Header/Icon/SnapChat.svg';
import { LinkedIn } from '../../../../components/SocialLogin/LinkedIn';
import { facebookLinkedLibrary } from '../../../../redux/actions';
import { API_MARKETING } from '../../../../constants';
import AccountConfig from '../FacebookCampaign/AccountConfig';

const SocialPostCampaignContent = (props) => {
  const { campaignFormData } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [profileCheckList, setProfileCheckList] = React.useState([]);
  const [change, setChange] = useState(false);
  const [socialMediaType, setSocialMediaType] = useState(campaignFormData && campaignFormData.linkedLibraries ? campaignFormData.selectedSocialMediaType : '');
  const [campaignManager, setcampaignManager] = React.useState([]);
  const [IntervalId, setIntervalId] = useState(0);
  const [pageFetch, setpageFetch] = useState(false);
  const [openModal, setopenModal] = useState(false);
  const [config, setconfig] = useState('');
  const [ErrorMsg, setErrorMsg] = useState('');

  const CampaignManagerResponse = () => {
    axios
      .get(`${API_MARKETING}/campaign-manager`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((response) => setcampaignManager(response.data));
  };
  const selectMediaType = (type) => {
    setSocialMediaType(type);
  };
  const CallPagesApi = () => {
    if (campaignFormData && campaignFormData.type === 'social_post') {
      axios
        .get(`${API_MARKETING}/socialmedia-page-list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('bearToken')}`
          }
        })
        .then((res) => {
          if (campaignFormData && campaignFormData.selectedSocialMediaType) {
            if (socialMediaType === 'facebook') {
              res.data.facebook.map((item) => {
                if (
                  item.page_id === campaignFormData.linkedLibraries.facebook[0]
                ) {
                  const selectedItem = item;
                  selectedItem.isSelected = true;
                }
                return item;
              });
            } else if (socialMediaType === 'linkedin') {
              res.data.linkedin.map((item) => {
                if (
                  item.page_id === campaignFormData.linkedLibraries.linkedin[0]
                ) {
                  const selectedItem = item;
                  selectedItem.isSelected = true;
                }
                return item;
              });
            }
          }
          setProfileCheckList(res.data);
          if (res.data.length !== 0 && (res.data.linkedin.length !== 0
            || res.data.facebook.length !== 0)) {
            setpageFetch(false);
            selectMediaType(socialMediaType);
          }
        });
    } else if (campaignFormData && campaignFormData.type === 'social_ad') {
      axios
        .get(`${API_MARKETING}/adAccounts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('bearToken')}`
          }
        })
        .then((res) => {
          if (campaignFormData && campaignFormData.selectedSocialMediaType) {
            if (socialMediaType === 'facebook') {
              res.data.facebook.map((item) => {
                if (
                  item.account_id
                  === campaignFormData.linkedLibraries.facebook[0]
                ) {
                  const selectedItem = item;
                  selectedItem.isSelected = true;
                }
                return item;
              });
            } else if (socialMediaType === 'linkedin') {
              res.data.linkedin.map((item) => {
                if (
                  item.account_id
                  === campaignFormData.linkedLibraries.linkedin[0]
                ) {
                  const selectedItem = item;
                  selectedItem.isSelected = true;
                }
                return item;
              });
            }
          }
          setProfileCheckList(res.data);
          if (res.data.length !== 0 && (res.data.linkedin.length !== 0
            || res.data.facebook.length !== 0)) {
            setpageFetch(false);
            selectMediaType(socialMediaType);
          }
        });
    }
  };
  useEffect(() => {
    CampaignManagerResponse();
    if (campaignFormData && campaignFormData.selectedSocialMediaType) {
      CallPagesApi();
    }
  }, []);
  const handleChange = (item) => {
    let Data = [];
    if (socialMediaType === 'instagram') {
      Data = profileCheckList.instagram;
    } else if (socialMediaType === 'facebook') {
      Data = profileCheckList.facebook;
    } else if (socialMediaType === 'linkedin') {
      Data = profileCheckList.linkedin;
    } else if (socialMediaType === 'twitter') {
      Data = profileCheckList.twitter;
    } else if (socialMediaType === 'snapchat') {
      Data = profileCheckList.snapchat;
    }
    const newData = Data.filter((page) => {
      const selecedPage = page;
      if (selecedPage.page_id === item.page_id) {
        if (selecedPage.isSelected) {
          selecedPage.isSelected = false;
        } else {
          selecedPage.isSelected = true;
        }
      } else {
        const unSelectedPage = page;
        unSelectedPage.isSelected = false;
        return unSelectedPage;
      }
      return selecedPage;
    });
    if (socialMediaType === 'instagram') {
      profileCheckList.instagram = newData;
    } else if (socialMediaType === 'facebook') {
      profileCheckList.facebook = newData;
    } else if (socialMediaType === 'linkedin') {
      profileCheckList.linkedin = newData;
    } else if (socialMediaType === 'twitter') {
      profileCheckList.twitter = newData;
    } else if (socialMediaType === 'snapchat') {
      profileCheckList.snapchat = newData;
    }
    setProfileCheckList(profileCheckList);
    setChange(!change);
  };

  const handleonChange = (item) => {
    let Data = [];
    if (socialMediaType === 'instagram') {
      Data = profileCheckList.instagram;
    } else if (socialMediaType === 'facebook') {
      Data = profileCheckList.facebook;
    } else if (socialMediaType === 'linkedin') {
      Data = profileCheckList.linkedin;
    } else if (socialMediaType === 'twitter') {
      Data = profileCheckList.twitter;
    } else if (socialMediaType === 'snapchat') {
      Data = profileCheckList.snapchat;
    }
    const newData = Data.filter((page) => {
      const selecedPage = page;
      if (selecedPage.account_id === item.account_id) {
        if (selecedPage.isSelected) {
          selecedPage.isSelected = false;
        } else {
          selecedPage.isSelected = true;
        }
      } else {
        const unSelectedPage = page;
        unSelectedPage.isSelected = false;
        return unSelectedPage;
      }
      return selecedPage;
    });
    if (socialMediaType === 'instagram') {
      profileCheckList.instagram = newData;
    } else if (socialMediaType === 'facebook') {
      profileCheckList.facebook = newData;
    } else if (socialMediaType === 'linkedin') {
      profileCheckList.linkedin = newData;
    } else if (socialMediaType === 'twitter') {
      profileCheckList.twitter = newData;
    } else if (socialMediaType === 'snapchat') {
      profileCheckList.snapchat = newData;
    }
    setProfileCheckList(profileCheckList);
    setChange(!change);
  };

  const onClickNext = () => {
    clearInterval(IntervalId);
    let Data = [];
    if (socialMediaType === 'instagram') {
      Data = profileCheckList.instagram;
    } else if (socialMediaType === 'facebook') {
      Data = profileCheckList.facebook;
    } else if (socialMediaType === 'linkedin') {
      Data = profileCheckList.linkedin;
    } else if (socialMediaType === 'twitter') {
      Data = profileCheckList.twitter;
    } else if (socialMediaType === 'snapchat') {
      Data = profileCheckList.snapchat;
    }
    const selectedData = [];
    if (campaignFormData && campaignFormData.type === 'social_post') {
      if (Data && Data.length > 0) {
        Data.map((item) => {
          if (item.isSelected) {
            selectedData.push(item.page_id);
          }
          return null;
        });
      }
    }
    if (campaignFormData && campaignFormData.type === 'social_ad') {
      Data.map((item) => {
        if (item.isSelected) {
          selectedData.push(item.account_id);
        }
        return null;
      });
    }
    if (selectedData.length !== 0) {
      const selectedLibrary = {
        selectedSocialMediaType: socialMediaType,
        linkedLibraries: {
          socialMediaType,
          [socialMediaType]: selectedData,
        },
        campaignManagerApiData: campaignManager
      };
      dispatch(facebookLinkedLibrary(selectedLibrary));
      if (socialMediaType === 'facebook') {
        history.push('/admin/campaigns/new/facebookCampaign');
      } else {
        history.push('/admin/campaigns/new/UndiffirentiatedCampaign');
      }
    } else {
      toast.error('Please choose atleast one record');
    }
  };

  function SocialToken(Id, _token, _redirectUrl) {
    return axios
      .post(`${API_MARKETING}/tokens`, { campaignManagerId: Id, token: _token, redirectUrl: _redirectUrl }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((res) => res)
      .catch((error) => error);
  }

  const responseFacebook = (response) => {
    setProfileCheckList([]);
    let CampiagnMngId = 0;
    campaignManager.campaignManagerData.filter((item) => {
      if (item.name === 'facebook') {
        CampiagnMngId = item.id;
      }
      return item.id;
    });
    SocialToken(CampiagnMngId, response.accessToken, '').then((fbResponse) => {
      if (fbResponse !== null) {
        if (fbResponse.data.statusCode === 200) {
          if (fbResponse.data.message === 'Token updated successfully') {
            setpageFetch(true);
            const intervalId = setInterval(CallPagesApi, 20000);
            setIntervalId(intervalId);
            document.getElementById('hdnIntervalId').value = intervalId;
          } else if (fbResponse.data.message === 'config') {
            setconfig('config');
            openModal(true);
          } else {
            setconfig('confirmation');
            openModal(true);
          }
        } else if (fbResponse.data.statusCode === 202) {
          setErrorMsg(fbResponse.data.message);
        }
      }
    });
  };
  const handleSuccess = (data) => {
    setErrorMsg('');
    setProfileCheckList([]);
    let CampiagnMngId = 0;
    campaignManager.campaignManagerData.filter((item) => {
      if (item.name === 'linkedin') {
        CampiagnMngId = item.id;
      }
      return item.id;
    });
    SocialToken(CampiagnMngId, data.code, `${window.location.origin}/admin/linkedin`).then((lnRes) => {
      if (lnRes !== null) {
        if (lnRes.data.statusCode === 200) {
          setpageFetch(true);
          const intervalId = setInterval(CallPagesApi, 20000);
          setIntervalId(intervalId);
          document.getElementById('hdnIntervalId').value = intervalId;
        } else if (lnRes.data.statusCode === 202) {
          setErrorMsg(lnRes.data.message);
        }
      }
    });
  };

  const handleFailure = (error) => {
    setErrorMsg('');
    toast.error(error);
  };

  const responseInstagram = (response) => {
    toast.info(response);
    selectMediaType('instgram');
  };

  const renderCheckboxList = (options) => {
    if (campaignFormData && campaignFormData.type === 'social_post') {
      return (
        <div className="checkbox_list">
          {
            options.map((item) => (
              <div className="checkbox_item" onClick={() => { handleChange(item); }} key={item.id}>
                <label htmlFor="conatinerLabel" className="container">
                  <input
                    type="checkbox"
                    name={item.page_name}
                    checked={item.isSelected}
                  />
                  <span className="checkmark" />
                  {item.page_name}
                  {clearInterval(IntervalId)}
                </label>
              </div>
            ))
          }
        </div>
      );
    }
    return (
      <div className="checkbox_list">
        {
          options.map((item) => (
            <div className="checkbox_item" onClick={() => { handleonChange(item); }}>
              <label htmlFor="conatinerLabel" className="container">
                <input
                  type="checkbox"
                  name={item.account_name}
                  checked={item.isSelected}
                />
                <span className="checkmark" />
                {item.account_name}
                {clearInterval(IntervalId)}
              </label>
            </div>
          ))
        }
      </div>
    );
  };

  const renderLinkedAccounts = () => {
    if (socialMediaType === 'facebook' && profileCheckList && profileCheckList.facebook) return renderCheckboxList(profileCheckList.facebook);
    if (socialMediaType === 'instagram' && profileCheckList && profileCheckList.instagram) return renderCheckboxList(profileCheckList.instagram);
    if (socialMediaType === 'linkedin' && profileCheckList && profileCheckList.linkedin) return renderCheckboxList(profileCheckList.linkedin);
    if (socialMediaType === 'twitter' && profileCheckList && profileCheckList.twitter) return renderCheckboxList(profileCheckList.twitter);
    if (socialMediaType === 'snapchat' && profileCheckList && profileCheckList.snapchat) return renderCheckboxList(profileCheckList.snapchat);
    return null;
  };

  const CallFBAccConfig = () => {
  };

  return (
    <>
      <div className="social_flex">
        <input id="hdnIntervalId" name="hdnIntervalId" type="hidden" />
        <input id="hdnIntervalCount" name="hdnIntervalCount" type="hidden" value="0" />
        <span
          className={socialMediaType === 'facebook' ? 'facebook' : 'facebook blurImage'}
          onClick={() => { selectMediaType('facebook'); }}
        >
          <FacebookLogin
            appId="910428652830113"
            callback={responseFacebook}
            fields="name,email,picture"
            scope="public_profile,pages_read_engagement,pages_manage_posts,pages_read_user_content"
            render={(renderProps) => (
              <img onClick={renderProps.onClick} src={Facebook} alt="Login with FB" />
            )}
          />
        </span>
        <span
          className={socialMediaType === 'instagram' ? 'instagram' : 'instagram blurImage'}
          onClick={() => { selectMediaType('instagram'); }}
        >
          <InstagramLogin
            clientId="5fd2f11482844c5eba963747a5f34556"
            onSuccess={responseInstagram}
            onFailure={responseInstagram}
            redirectUri={window.location.href}
            render={({ onClick }) => (
              <img onClick={onClick} src={Instagram} alt="Log in with Facebook" style={{ maxWidth: '180px', cursor: 'pointer' }} />
            )}
          />
        </span>
        <span onClick={() => { selectMediaType('linkedin'); }}>
          <LinkedIn
            clientId="86v53knx8uv2qx"
            redirectUri={`${window.location.origin}/admin/linkedin`}
            scope="r_basicprofile,r_organization_social,r_1st_connections_size,r_ads_reporting,rw_organization_admin,r_ads,rw_ads,w_member_social,w_organization_social"
            state="34232423"
            onFailure={handleFailure}
            onSuccess={handleSuccess}
            supportIE
            redirectPath="/admin/linkedin"
            className={socialMediaType === 'linkedin' ? 'linkedin' : 'linkedin blurImage'}
          >
            <img src={LinkedInIcon} alt="Log in with Linked In" />
          </LinkedIn>
        </span>
        <span
          className={socialMediaType === 'twitter' ? 'twitter' : 'twitter blurImage'}
          onClick={() => { selectMediaType('twitter'); }}
        >
          <img src={Twitter} alt="" />
        </span>
        <span
          className={socialMediaType === 'snapchat' ? 'snapchat' : 'snapchat blurImage'}
          onClick={() => { selectMediaType('snapchat'); }}
        >
          <img src={SnapChat} alt="" />
        </span>
      </div>
      <div className="social_post_select">
        <span className="social_post_select_text">Select from your linked accounts below</span>
      </div>

      <div className="social_post_group">
        <div className="social_post_group_one">
          {pageFetch
            ? (
              <div className="pageLoader">
                {campaignFormData.type === 'social_post' ? 'Please wait, fetching accounts…' : 'Please wait, fetching accounts…'}
                <br />
                <Loader
                  type="Oval"
                  color="#008080"
                  height={30}
                  width={30}
                />
              </div>
            )
            : null}
          {ErrorMsg !== '' ? <div className="SocialErrorMsg">{ErrorMsg}</div> : null}
          {renderLinkedAccounts()}
        </div>
      </div>
      {openModal ? <AccountConfig isOpen={openModal} setopenModal={setopenModal} CallFBAccConfig={CallFBAccConfig} config={config} /> : ''}
      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Next</span>
        </Button>
      </div>

    </>
  );
};

SocialPostCampaignContent.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

SocialPostCampaignContent.defaultProps = {
  campaignFormData: {},
};

export default SocialPostCampaignContent;
