/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { connect, useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { NavLink, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { sortBy, isEmpty } from 'lodash';
import moment from 'moment';
import CustomIcon from '../../../components/common/CustomIcon';
import CustomSwitch from '../../../components/common/CustomSwitch';
import Loader from '../../../components/common/AdminLoader';
import ProductCommentList from '../../../components/common/ProductCommentList';
import './index.scss';
import formatter from '../../../utils/moneyFormatter';
import {
  getProductDetail,
  updateAdminProduct,
  createProductAsset,
  deleteAdminProductAsset,
  reorderCoverPhoto
} from '../../../api/adminProducts';
import { onChangeAdminProduct, setCoverPhotoOrder } from '../../../redux/actions';
import CountryCodeDropDown from '../../../components/common/CountryCodeDropDown';
import { DescriptionSharp } from '@material-ui/icons';

const styles = (theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginTop: '10px',
    },
  },
  input: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  halfSize: {
    width: '49%'
  },
  selectField: {
    marginTop: '10px'
  },
  h4: {
    fontSize: '15px',
    lineHeight: '19px',
    fontWeight: '700',
    margin: '0',
    color: '#000000',
    paddingTop: '20px'
  },
  headingBox: {
    marginTop: '0px !important'
  },
  searchInput: {
    paddingLeft: '30px',
    width: '100%'
  }
});

const years = [{ label: 'none', value: '' }];
const currentYear = new Date();
for (let i = currentYear.getFullYear(); i > 1900; i--) {
  years.push({
    label: `${i}`,
    value: `${i}`
  });
}

const renderTableActions = () => (
  <div className="table-actions">
    <button className="sendBtn">
      <UncontrolledDropdown className="moreOptionsConnew" direction="left">
        <DropdownToggle>
          <button className="sendBtn">
            <CustomIcon icon="Header/Icon/More" />
          </button>
        </DropdownToggle>
        <DropdownMenu>
          <NavLink to="/admin/archivedproducts">
            <DropdownItem>
              <CustomIcon icon="Archive" />
              View Archive
            </DropdownItem>
          </NavLink>
        </DropdownMenu>
      </UncontrolledDropdown>
    </button>
    <button className="sendBtn">
      <i className="fas fa-times" />
    </button>
  </div>
);

const checkType = (type) => {
  const currentYear = new Date().getFullYear();
  let TypeVal = '';
  if (type) {
    if (type >= currentYear) {
      TypeVal = 'New';
    } else {
      TypeVal = 'Used';
    }
  } else {
    TypeVal = '';
  }
  return TypeVal;
};

const ProductDetail = (props) => {
  const [files, setFiles] = useState([]);
  const [filtered, setFiltered] = useState(years);
  const [selected, setSelected] = useState({});
  const [cover_photo, setCover_photo] = useState({ value: false, id: 0 });
  const [loading, setLoading] = useState(cover_photo);
  const [loadingReorder, setLoadingReorder] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [brochure, setBrochure] = useState(false);
  const [report, setReport] = useState(false);
  const remainingCoverPhotos = [];

  const product = useParams();

  const dispatch = useDispatch();
  const { adminProductDetail, productStatuses } = props;

  useEffect(() => {
    dispatch(getProductDetail(props.match));
  }, []);

  const { client } = useSelector((state) => state);

  const onDrop = (files, type, id) => {

    if((type === 'report' || 'brochure') && (files[0].size > 10728640)){
      toast.error('You can upload file up to 10 MB only.');
      return
    }
    const data = new FormData();
    data.append(type, files[0]);
    data.append('type', type);
    upload(data, type, id);
  };

  const upload = (data, type, id) => {
    const { dispatch } = props;

    setLoading({
      ...loading,
      [type]: {
        value: true,
        id
      },
    });
    dispatch(createProductAsset(adminProductDetail.id, data)).then(res => {
      setLoading({
        ...loading,
        [type]: false,
      })
      dispatch(getProductDetail(adminProductDetail.id));
    })
    .catch(error => {
      setLoading({
        ...loading,
        [type]: false,
      })
    });
  };

  const deleteProductAsset = (id, type) => {
    const { dispatch } = props;
    dispatch(deleteAdminProductAsset(id, type))
  };

  const onDragEnd = (result) => {

    const { draggableId, destination, source } = result;
    const { dispatch } = props;

    if (isEmpty(result)) {
      return;
    }
    const productAssetIndex = adminProductDetail.productAssets.findIndex((productAsset) => {
      return draggableId === productAsset.id
    })

    const productAsset = adminProductDetail.productAssets.find((productAsset) => {
      return draggableId === productAsset.id
    })

    const productAssetOrder = productAsset.order || productAssetIndex + 1;

    const currentOrder = destination.index > source.index ? productAssetOrder + destination.index:
    productAssetOrder - destination.index + 1;

    const productAssetsState = adminProductDetail.productAssets.map((productAsset, index) => {
      let order = productAsset.order || (index + 1);
      if (productAsset.id !== draggableId && destination.index > source.index && currentOrder >= order ) {
        order--;
      }
      else if (productAsset.id !== draggableId && destination.index < source.index && currentOrder > order ) {
        order++;
      }
      return {
        id: productAsset.id,
        order
      }
    })

    productAssetsState[productAssetIndex].order =  destination.index + 1;;

    dispatch(setCoverPhotoOrder({
      assets: productAssetsState
    }));

    dispatch(reorderCoverPhoto( product.id,{
      assets: productAssetsState
    })).then(() => {
      setLoadingReorder(false)
    })
  };

  const filterData = (search) => {
    if (search !== '') {
      const temp = [];
      years.map((o) => {
        if (o.label.toLowerCase().includes(search.toLowerCase())) { temp.push(o); }
      });
      setFiltered(temp);
    } else {
      setFiltered(years);
    }
  };

  const onChange = (e, key, product, index) => {
    let value = ['modelYear', 'productStatus'].includes(key) ? e.value : e.target.value;
    if (key === 'price') {
      if (value.length > 0) value = parseInt(value.toString().replace(',', ''));
      if (isNaN(value) && value !== '') {
        return;
      }
    }
    dispatch(onChangeAdminProduct(value, key, product, index));
  };

  const onSave = (item, index, payload) => {
    dispatch(updateAdminProduct(item.id, item));
  };

  if (adminProductDetail && adminProductDetail.productAssets) {
    for (
      let i = 0;
      i
      < 4
      - adminProductDetail.productAssets.filter((asset) => asset.type === 'cover_photo').length;
      i++
    ) {
      remainingCoverPhotos.push(i);
    }
  }

  return (
    <>
      <div className="innerFullCon flex product-con productDetailView">
        <div className="middleCon con">
          <form className={styles.root}>
            <h4 className={styles.h4}>Product Description</h4>
            <>
              <TextField
                className="prodDescription"
                variant="outlined"
                size="small"
                fullWidth
                rows="4"
                value={adminProductDetail && adminProductDetail.description || ''}
                multiline
                onChange={(e) => onChange(e, 'description', adminProductDetail)}
                onBlur={(e) => onSave(adminProductDetail, adminProductDetail.id, {
                  description: e.target.value,
                })}
              />
              {
                client.domain == 'cbops' ? <>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Manufacturer"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.manufacturer || '-'}
                    />
                    <TextField
                      size="small"
                      label="Model"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.model || '-'}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Category"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.category || '-'}
                    />
                    <TextField
                      size="small"
                      label="Advt. price"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.advertisedPrice || '-'}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Model Year"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.modelYear || '-'}
                      onChange={(e) => onChange(e, 'modelYear', adminProductDetail)}
                      onBlur={(e) => onSave(adminProductDetail, adminProductDetail.id, {
                        modelYear: e.target.value,
                      })}
                    />
                    <TextField
                      size="small"
                      label="Type"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={checkType(adminProductDetail?.modelYear)}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Horse Power"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.horsePower || '-'}
                    />
                    <TextField
                      size="small"
                      label="Operational Hours"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.operationHours || '-'}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Stock no"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.stockNumber || '-'}
                    />
                    <TextField
                      size="small"
                      label="Serial no"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.serialNumber || '-'}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="City"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.city && adminProductDetail.city.name || '-'}
                    />
                    <TextField
                      size="small"
                      label="Status"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.productStatus && adminProductDetail.productStatus.status || '-'}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Make"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.manufacturer || '-'}
                    />
                    <TextField
                      size="small"
                      label="Model Name"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.modelName || '-'}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Region"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.region || '-'}
                    />
                    <TextField
                      size="small"
                      label="State"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.city && adminProductDetail.city.state && adminProductDetail.city.state.name || '-'}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Product Category"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.category || '-'}
                    />
                    <TextField
                      size="small"
                      label="VIN NO"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.vinNumber || '-'}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Cost (WholeSale)"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.cost || '-'}
                    />
                    <TextField
                      size="small"
                      label="Sales Date"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.salesDate || '-'}
                    />
                  </div>
                  <div className="prodInput">
                    <TextField
                      size="small"
                      label="Hours"
                      variant="outlined"
                      className="prodHalfSize"
                      disabled="true"
                      value={adminProductDetail.operationHours || '-'}
                    />
                  </div>
                </>
              :
              <>
              <div className="prodInput">
                <TextField
                  size="small"
                  label="Machine"
                  variant="outlined"
                  className="prodHalfSize"
                  value={adminProductDetail.machine || ''}
                  onChange={(e) => onChange(e, 'machine', adminProductDetail)}
                  onBlur={(e) => onSave(adminProductDetail, adminProductDetail.id, {
                    machine: e.target.value,
                  })}
                />
                <TextField
                  size="small"
                  label="Category"
                  variant="outlined"
                  className="prodHalfSize"
                  value={adminProductDetail.category || ''}
                  onChange={(e) => onChange(e, 'category', adminProductDetail)}
                  onBlur={(e) => onSave(adminProductDetail, adminProductDetail.id, {
                    category: e.target.value,
                  })}
                />
              </div>
              <div className="prodInput">
                <TextField
                  size="small"
                  label="Price"
                  variant="outlined"
                  className="prodHalfSize"
                  value={formatter.format(adminProductDetail.price) || ''}
                  onChange={(e) => onChange(e, 'price', adminProductDetail)}
                  onBlur={(e) => onSave(adminProductDetail, adminProductDetail.id, {
                    price: e.target.value,
                  })}
                />
                <UncontrolledDropdown
                  id={adminProductDetail.id}
                  className={
                    !selected && !selectedValue
                      ? 'tableOptions dropdown_wrapper selectbox'
                      : 'tableOptions dropdown_wrapper'
                  }
                  style={{ width: '48%' }}
                >
                  <DropdownToggle>
                    <TextField
                      size="small"
                      label="Year"
                      variant="outlined"
                      className="dropDowns showCursor"
                      value={adminProductDetail.modelYear || ''}
                    />
                    <CustomIcon
                      icon="Dropdown/toggle"
                      className="dropdown-toggle-con"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <div className="searchTabs">
                      <CustomIcon icon="Search" />
                      <input
                        className={`${'form-control' + ' '}${ styles.searchInput}`}
                        autoComplete="false"
                        autoCapitalize="off"
                        type="text"
                        onChange={(e) => filterData(e.target.value)}
                      />
                    </div>
                    {years.length > 0 && filtered.length >= 0 ? (
                      filtered.map((data, i) => (
                        <DropdownItem
                          key={i}
                          onClick={() => {
                            onChange({value: data.value}, 'modelYear', adminProductDetail);
                            onSave({...adminProductDetail,
                              modelYear: data.value,
                            }, adminProductDetail.id, {
                              modelYear: data.value,
                            });
                          }}
                        >
                          {data.label}
                        </DropdownItem>
                      ))
                    ) : (
                      <DropdownItem>No record</DropdownItem>
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
              <div className="prodInput">
                <TextField
                  size="small"
                  label="Make"
                  variant="outlined"
                  className="prodHalfSize"
                  value={adminProductDetail.manufacturer || ''}
                  onChange={(e) => onChange(e, 'manufacturer', adminProductDetail)}
                  onBlur={(e) => onSave(adminProductDetail, adminProductDetail.id, {
                    manufacturer: e.target.value,
                  })}
                />
                <TextField
                  size="small"
                  label="Model"
                  variant="outlined"
                  className="prodHalfSize"
                  value={adminProductDetail.model || ''}
                  onChange={(e) => onChange(e, 'model', adminProductDetail)}
                  onBlur={(e) => onSave(adminProductDetail, adminProductDetail.id, {
                    model: e.target.value,
                  })}
                />
              </div>
              <div className="prodInput">
                <UncontrolledDropdown
                  id={adminProductDetail.id}
                  className={
                    !selected && !props.selectedValue
                      ? 'tableOptions dropdown_wrapper selectbox'
                      : 'tableOptions dropdown_wrapper'
                  }
                  style={{ width: '48%' }}
                >
                  <DropdownToggle>
                    <TextField
                      size="small"
                      label="Status"
                      variant="outlined"
                      className="dropDowns showCursor"
                      value={adminProductDetail?.productStatus?.status || ''}
                    />
                    <CustomIcon
                      icon="Dropdown/toggle"
                      className="dropdown-toggle-con"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    {productStatuses && productStatuses.length > 0 ? (
                      productStatuses.map((data, i) => (
                        <DropdownItem
                          key={i}
                          onClick={() => {
                            onChange({
                              value: {
                              id: data.value,
                              status: data.label}}, 'productStatus', adminProductDetail);
                            onSave({...adminProductDetail,
                                productStatusId: data.value,
                            }, adminProductDetail.id, {
                              productStatusId: data.value,
                            });
                          }}
                        >
                          {data.label}
                        </DropdownItem>
                      ))
                    )

                      : (
                        <DropdownItem>No record</DropdownItem>
                      )}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <TextField
                  size="small"
                  label="Type"
                  variant="outlined"
                  className="prodHalfSize"
                  value={checkType(adminProductDetail?.modelYear)}
                />
              </div>
              <div className="prodInput">
                <TextField
                  size="small"
                  label="Cost"
                  variant="outlined"
                  className="prodHalfSize"
                  value={adminProductDetail.cost || '-'}
                  onChange={(e) => onChange(e, 'cost', adminProductDetail)}
                  onBlur={(e) => onSave(adminProductDetail, adminProductDetail.id, {
                    cost: e.target.value,
                  })}
                />
              </div>
              </>}
            </>
          </form>
        </div>
        <div className="leftCon con">
          <div className="cardHeader " style={{ boxShadow: 'none' }}>
            <h4>Cover Photos</h4>
            <p>This photo will be visible to customers.</p>
          </div>
          <DragDropContext  onDragEnd={(result) => {
            if (!loadingReorder) {
              onDragEnd(result);
            }
          }}>
            <Droppable droppableId="droppableId" direction="horizontal">
              {(provided) => (
                <div
                  className="imagesSection"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {adminProductDetail.productAssets
                    && _.sortBy(adminProductDetail.productAssets , [function(o) { return o.order; }])
                      .filter((asset) => asset.type === 'cover_photo')
                      .map((cover, index) => (
                        <Draggable
                          draggableId={cover.id}
                          index={index}
                          key={cover.id}
                        >
                          {(draggableProvided) => (
                            <div
                              className="imgCon"
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              ref={draggableProvided.innerRef}
                            >
                              <div className="img noBorder">
                                <img src={cover.url} />
                              </div>
                              <p className="imgText">
                                {index + 1}
                                . Preview
                              </p>
                              <div className="delete-msg-container">
                                <i
                                  className="delete"
                                  onClick={() => deleteProductAsset(
                                    cover.id,
                                    'cover_photo'
                                  )}
                                >
                                  <CustomIcon icon="Delete" />
                                </i>
                                <span className="delete-message">
                                  Delete this photo
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                  {remainingCoverPhotos.map((cover, index) => (
                    <Dropzone
                      onDrop={(files) => onDrop(files, 'cover_photo', index)}
                      key={cover.id}
                      accept="image/*"
                      maxSize={5242880}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          className="imgCon"
                          {...getRootProps()}
                        >
                          <div className="img" />
                          <p className="imgText">
                            {4 - (remainingCoverPhotos.length - 1) + index}
                          </p>
                          <i>
                            <CustomIcon icon="Header/Icon/Add" />
                          </i>
                          <input {...getInputProps()} />
                        </div>
                      )}
                    </Dropzone>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="cardHeader " style={{ boxShadow: 'none' }}>
            <h4>Other Photos</h4>
            <p>Other than cover photos can be listed here.</p>
          </div>
          <div className="imagesSection">
            {adminProductDetail.productAssets
              && adminProductDetail.productAssets
                .filter((asset) => asset.type === 'photo' || asset.type === 'other_photo')
                .map((photo) => (
                  <div className="imgCon" key={photo.id}>
                    <div className="img noBorder">
                      <img src={photo.url} />
                    </div>
                    <i
                      className="delete"
                      onClick={() => deleteProductAsset(photo.id, 'Photo')}
                    >
                      <CustomIcon icon="Delete" />
                    </i>
                  </div>
                ))}
            <Dropzone
              onDrop={(files) => onDrop(files, 'other_photo')}
              accept="image/*"
              maxSize={5242880}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="imgCon" {...getRootProps()}>
                  <div className="img" />
                  {loading.photo ? (
                    <i>
                      <Loader />
                    </i>
                  ) : (
                    <i className="fas fa-image" />
                  )}
                  <input {...getInputProps()} />
                </div>
              )}
            </Dropzone>
          </div>
          <div className="flex flex-wrap">
            {adminProductDetail.productAssets
              && adminProductDetail.productAssets
                .filter((asset) => asset.type === ('brochure' || 'report'))
                .map((asset) => (
                  <div className="file-preview" key={asset.id}>
                    <div className="cardHeader" style={{ boxShadow: 'none' }}>
                      <div className="flex justify-content-between align-items-center">
                        <h4>
                          {asset.type.substr(0, 1).toUpperCase()
                            + asset.type.substr(1)}
                        </h4>
                        <CustomSwitch checked />
                      </div>
                      <p>PDF file supported upto 10MB.</p>
                    </div>
                    <div className="content">
                      <div className="dragDrop dragDrop-no-dash">
                        <embed
                          src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${asset.url}`}
                          type={asset.fileType}
                          frameBorder="0"
                          scrolling="no"
                          width="100%"
                          height="100%"
                        />
                        <div className="brochure-delete">
                          <i
                            className="delete"
                            onClick={() => deleteProductAsset(asset.id, asset.type)}
                          >
                            <CustomIcon icon="trash" />
                          </i>
                        </div>
                      </div>
                      <h4>
                        <h4>{asset.fileName.split('.')[0]}</h4>
                        <span className="time">
                          Updated on:
                          {' '}
                          {moment(asset.createdAt).format('MM/DD/YYYY')}
                        </span>
                      </h4>
                    </div>
                  </div>
                ))}

            <div className="file-preview">
              <div className="cardHeader">
                <div className="flex justify-content-between align-items-center">
                  <h4>Brochure</h4>
                  <CustomSwitch />
                </div>
                <p>PDF file supported upto 10MB.</p>
              </div>
              <Dropzone
                onDrop={(files) => onDrop(files, 'brochure')}
                accept="application/pdf"
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="content">
                    <div {...getRootProps()} className="dragDrop">
                      <i>
                        {loading.brochure ? (
                          <Loader />
                        ) : (
                          <CustomIcon icon="Header/Icon/Add" />
                        )}
                      </i>
                      <input id="brochure" {...getInputProps()} />
                    </div>
                    <h4>
                      <label htmlFor="brochure">
                        {loading.brochure
                          ? 'Uploading...'
                          : 'Upload file'}
                      </label>
                    </h4>
                  </div>
                )}
              </Dropzone>
            </div>
            <div className="file-preview">
              <div className="cardHeader">
                <div className="flex justify-content-between align-items-center">
                  <h4>Report</h4>
                  <CustomSwitch />
                </div>
                <p>PDF file supported upto 10MB.</p>
              </div>
              <Dropzone
                onDrop={(files) => onDrop(files, 'report')}
                accept="application/pdf"
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="content">
                    <div {...getRootProps()} className="dragDrop">
                      <i>
                        {loading.report ? (
                          <Loader />
                        ) : (
                          <CustomIcon icon="Header/Icon/Add" />
                        )}
                      </i>
                      <input id="report" {...getInputProps()} />
                    </div>
                    <h4>
                      <label htmlFor="report">
                        {loading.report
                          ? 'Uploading...'
                          : 'Upload file'}
                      </label>
                    </h4>
                  </div>
                )}
              </Dropzone>
            </div>
          </div>
        </div>
        <div className="rightCon con">
          <ProductCommentList product={adminProductDetail} dispatch={dispatch} />
        </div>
      </div>
    </>
  );
};

ProductDetail.propTypes = {
  classes: PropTypes.object,
  dispatch: PropTypes.func,
  product: PropTypes.object,
  statuses: PropTypes.array,
  selectedValue: PropTypes.bool
};

const mapStateToProps = (state) => ({
  adminProductDetail: state.adminProduct.adminProductDetail,
  productStatuses: state.adminProduct.productStatuses,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
