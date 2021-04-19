/* eslint-disable */
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPlayer from 'react-player';
import CampaignsPreviewHeader from './CampaignPreviewHeader';
import DefualtText from '../../../assets/images/text.png';
import CampaignAnalytics from './CampaignAnalytics';
import CampaignResponse from './CampaignResponse';
import CamapignComments from './CamapignComments';
import CampaignMessages from './CampaignMessages';
import { API_MARKETING } from '../../../constants';
import AnalyticsChatBody from '../../../components/AnalyticsChatBody';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function removeLayerOffset() {
  const textLayers = document.querySelectorAll('.react-pdf__Page__textContent');
  textLayers.forEach((layer) => {
    const { style } = layer;
    style.display = 'none';
  });
}

class CampaignPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // file: '',
      imagePreviewUrl: '',
      numPages: null,
      pageNumber: 1,
      activeTab: 0,
    };
    this.handleDuplicateApi = this.handleDuplicateApi.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    this.changePage = this.changePage.bind(this);
    this.switchTab = this.switchTab.bind(this);   
    this.onEditBtnClick = this.onEditBtnClick.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  handleDuplicateApi(Id) {
    axios
      .post(`${API_MARKETING}/duplicate`, { campaignId: Id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('bearToken')}`
        }
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success('Campaign duplicate successfully');
        } else {
          toast.error('Campaign duplicate unsuccessfull');
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  }
  
  onEditBtnClick () {   
    this.props.history.push('/admin/campaigns/new');
    console.log(this.props.history.push ({
      state: {previewTitle : localStorage.getItem('previewTitle') }
    }));
  };

  onDocumentLoadSuccess(document) {
    const { numPages } = document;
    this.setState({
      pageNumber: 1,
      numPages
    });
  }

  changePage(offset) {
    const { pageNumber, numPages } = this.state;
    if (pageNumber + offset > 0 && pageNumber + offset <= numPages) {
      this.setState((prevState) => ({
        pageNumber: prevState.pageNumber + offset
      }));
    }
  }  

  previousPage() { this.changePage(-1); }

  nextPage() { this.changePage(1); }

  switchTab(index) {
    this.setState({
      activeTab: index
    });
  }

  renderPreview(extFile, $imagePreview, previewTextData, textFileType) {
    return (
      <div className={(extFile.toLowerCase() === 'mp4' || extFile.toLowerCase() === 'jpg' || extFile.toLowerCase() === 'jpeg' || extFile.toLowerCase() === 'png' || extFile.toLowerCase() === 'svg') ? 'imgPreview' : 'vidPreview'} // imagePreviewUrl === ''
      >
        {textFileType === 'text' ? (
          <div className="text-center">
            <p>{previewTextData.subject}</p>
            <p>{previewTextData.content}</p>
            <p>{previewTextData.url}</p>
          </div>
        ) :
          $imagePreview}
      </div>
    );
  }

  renderPreviewComponent(extFile, $imagePreview, imagePreviewUrl, previewTextData, textFileType, campaignId, campaignType, subject) {
    const { activeTab } = this.state;

    if (activeTab === 0) {
      return (
        <div className="MainPreview">
          {extFile.toLowerCase() === 'pdf'
            ? (
              <div className="pdf_campaign-container-preview center-box">
                <div className="previewContainer">
                  {$imagePreview}
                </div>
              </div>
            )
            : (
              <div className="campaign-container-preview center-box">
                <div className="previewContainer">
                  <div className="previewComponent center-box">
                    <div className="previewComponent-inner align-center">
                      <div className="campaigninnerTitle heading-top">{subject}</div>
                      {this.renderPreview(
                        extFile, $imagePreview, previewTextData, textFileType
                      )}
                    </div>
                    <p className="copy-text">HeyArrow @2020. All rights reserved</p>
                  </div>
                </div>
              </div>
            )}
          <div className={extFile.toLowerCase() === 'pdf' ? 'campaign-container-preview-right right-chat' : 'campaign-container-preview-right right__chat'}>
          <AnalyticsChatBody />
          </div>
        </div>
      );
    }
    if (activeTab === 1) return <CampaignAnalytics campaignId={campaignId} campaignType={campaignType} />;
    if (activeTab === 2) return <CampaignResponse campaignId={campaignId} campaignType={campaignType} />;
    if (activeTab === 3) return <CamapignComments campaignId={campaignId} campaignType={campaignType} />;
    if (activeTab === 4) return <CampaignMessages campaignId={campaignId} campaignType={campaignType} />;
    return null;
  }

  render() {
    const { numPages, pageNumber, activeTab } = this.state;
    let { imagePreviewUrl } = this.state;
    let previewTitle = '';
    let $imagePreview = null;
    let extFile = '';
    let previewTextData = '';
    let textFileType = '';
    let campaignId = '';
    let campaignType = '';
    let campaignCreatedDate = '';
    let subject = '';
    let status = '';
    if (localStorage.getItem('previewImage')) {
      imagePreviewUrl = localStorage.getItem('previewImage');
    }
    if (localStorage.getItem('campaignCreatedAt')) {
      campaignCreatedDate = localStorage.getItem('campaignCreatedAt');
    }
    if (localStorage.getItem('subject')) {
      subject = localStorage.getItem('subject');
    }
    if (localStorage.getItem('previewItemId')) {
      campaignId = localStorage.getItem('previewItemId');
    }
    if (localStorage.getItem('previewItemType')) {
      campaignType = localStorage.getItem('previewItemType');
    }
    if (localStorage.getItem('previewTitle')) {
      previewTitle = localStorage.getItem('previewTitle');
    }
    if (localStorage.getItem('previewstatus')) {
      status = localStorage.getItem('previewstatus');
    }
    if (localStorage.getItem('previewTextData')) {
      previewTextData = JSON.parse(localStorage.getItem('previewTextData'));
      [, textFileType] = previewTextData.fileType.split('/');
    }
    if (imagePreviewUrl) {
      const ext = imagePreviewUrl.split('.').pop();
      extFile = ext;
      if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg' || ext.toLowerCase() === 'png' || ext.toLowerCase() === 'svg' || ext.toLowerCase() === 'jfif') {
        $imagePreview = (<img src={imagePreviewUrl} alt={previewTitle} />);
      } else if (ext === 'mp4' || ext.toLowerCase() === 'mov' || ext.toLowerCase() === 'wmv') {
        $imagePreview = (
          <ReactPlayer
            url={imagePreviewUrl}
            className="react-player"
            // playing
            width="100%"
            height={ext.toLocaleLowerCase() === 'wmv' ? '35%' : '100%'}
            controls
          />
        );
      } else if (ext === 'pdf') {
        $imagePreview = (
          <div>
            <nav>
              <Button
                onClick={() => this.changePage(-1)}
                value={numPages}
              >
                Prev
              </Button>
              <Button onClick={() => this.changePage(1)} style={{ float: 'right' }}>Next</Button>
            </nav>
            <div className="pdf_preview">
              <Document
                className="imgPreview"
                file={imagePreviewUrl}
                onLoadSuccess={this.onDocumentLoadSuccess}
                option={{
                  maxImageSize: 1
                }}
              >
                <Page
                  pageNumber={pageNumber}
                  onLoadSuccess={removeLayerOffset}
                />
              </Document>
            </div>
          </div>
        );
      } else {
        $imagePreview = (<img src={DefualtText} alt={previewTitle} width="80" height="80" />);
      }
    } else {
      $imagePreview = (<img src={DefualtText} alt={previewTitle} width="80" height="80" />);
    }
    return (
      <div>
        <CampaignsPreviewHeader statused={status} campaignId={campaignId} handleDuplicateApi={this.handleDuplicateApi} title={previewTitle} BtnContent="Draft" BtnRightContent="Edit" activeTab={activeTab} switchTab={this.switchTab} campaignCreatedDate={campaignCreatedDate} campaignType={campaignType} onEditBtnClick={this.onEditBtnClick} />
        {this.renderPreviewComponent(extFile, $imagePreview, imagePreviewUrl, previewTextData, textFileType, campaignId, campaignType, subject)}
      </div>
    );
  }
}

export default CampaignPreview;
