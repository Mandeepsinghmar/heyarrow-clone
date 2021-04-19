/* eslint-disable */

import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import { isEmpty } from 'lodash';
import CustomIcon from '../CustomIcon';
import ProfileInitials from '../ProfileInitials';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import reformatNumber from '../../../utils/reformatNumber';
import StatesDropDown from '../StatesDropDown';
import CitiesDropDown from '../CitiesDropDown';
import AssignToDropDown from '../AssignToDropDown';
import { getCities, getStates } from '../../../api';
import './index.scss';

// Future used
// const historyMessageList = [
//   "<b>You </b> have updated <b>assign to </b> from <b>John Doe </b>  to <b>Chris Frank </b> <i style='margin-left: 2px'>20  hours ago</i>  ",
//   "<b>You </b> have updated <b>assign to </b> from <b>John Doe </b>  to <b>Chris Frank </b> <i style='margin-left: 2px'>20  hours ago</i>  ",
//   "<b>You </b> have updated <b>assign to </b> from <b>John Doe </b>  to <b>Chris Frank </b> <i style='margin-left: 2px'>20  hours ago</i>  ",
//   "<b>You </b> have updated <b>assign to </b> from <b>John Doe </b>  to <b>Chris Frank </b> <i style='margin-left: 2px'>20  hours ago</i>  ",
//   "<b>You </b> have updated <b>assign to </b> from <b>John Doe </b>  to <b>Chris Frank </b> <i style='margin-left: 2px'>20  hours ago</i>  ",
// ];

function DetailDrawer({ label, columns, data, isDrawerOpen,assignSalesRepHandler, toggleDrawer, onSave, onChange }) {
  const [isLocked, setIsLocked] = useState(true);
  const [cities, setCities] = useState([]);
  const [stateId, setStateId] = useState('');
  const dispatch = useDispatch();
  const { states } = useSelector((state) => state.common);
  const onStateOpen = () => {
    dispatch(getStates());
  };
  const onStateChange = (e) => {
    const id = e?.target?.value;
    setStateId(id);
    dispatch(getCities(id)).then((_data) => {
      setCities(_data);
    });
  };
  const onCityChange = (e) => {
    console.log('e',e)
    const id = e?.target?.value;
    const _stateName = states.find(s=>s.id == stateId)?.name
    const _cityName = cities.find(s=>s.id == id)?.name
    const valTarget = {
      target: {
        value: _cityName,
        state:_stateName
      },
    };
    onChange(valTarget, 'cityName', data, data['index']);
    onChange(e, 'cityId', data, data['index']);
    if (data.id) {
      onSave(data, data['index']);
    }
  };
  const onSelectAssignTo = (e) =>{
    assignSalesRepHandler(data.id,e.target.value)
    //console.log('e',e)
  }
  const onBlur = (e, key, type, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (data.id) {
      onSave(data, index, {
        [key]: (type == 'phone' && reformatNumber(e.target.value)) || e.target.value.replace('$', '').replace(/,/g, ''),
      });
    }
  };

  const onKeyDownInput = (e, key, type, index) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      onSave(data, index, {
        [key]: (type === 'phone' && reformatNumber(e.target.value)) || e.target.value.replace('$', '').replace(/,/g, ''),
      });
    }
  };

  const renderContent = (detail) => {
    switch (detail.field.type) {
      case 'profile':
        return  <div className="detailDrawer__field-key">{!isEmpty(data?.salesRep?.firstName) ? data?.salesRep?.firstName+' '+data?.salesRep?.lastName : '-'}</div>;
      default:
        return <div className="detailDrawer__field-key">{!isEmpty(data[detail.field.key]) ? data[detail.field.key] : '-'}</div>;
    }
  };

  const renderContentEditable = (detail) => {
    if (detail?.field?.readOnly) {
      return <div className="detailDrawer__field-key">{data[detail.field.key]?.firstName  + ' ' + data[detail.field.key]?.lastName} </div>;
    }

    switch (detail?.field?.type) {
      case 'profile':
        return  <AssignToDropDown
        placeholder="-Select-"
        readOnly={false}
        onSelect={(data) => onSelectAssignTo(data)}
        selectedSalesRep={data?.salesRep}
      />
        case 'state':
          return <div className="editingInput" style={{height: '28px'}}>
            <StatesDropDown
          isFilter
          item={states}
          onClick={onStateOpen}
          selectedValue={data[detail?.field?.key]}
          onSelect={onStateChange}
          placeholder="State"
          customer
        />
        </div>
          case 'city':
            return <div className="editingInput" style={{height: '28px'}}><CitiesDropDown
            isFilter
            selectedValue={data[detail?.field?.key]}
            onSelect={onCityChange}
            placeholder="City"
            item={{cities,isNewItem: true,stateId}}
            customer
          /></div>
      default:
        return (
          <input
            type={detail?.field?.type === 'email' ? 'email' : 'text'}
            placeholder={detail?.field?.label}
            value={data[detail?.field?.key] || ''}
            className="editingInput"
            onChange={(e) => {
              onChange(e, detail?.field?.key, data, data['index']);
            }}
            onKeyDown={(e) => onKeyDownInput(e, detail?.field?.key, detail?.field?.type, data['index'])}
            onBlur={(e) => onBlur(e, detail?.field?.key, detail?.field?.type, data['index'])}
          />
        );
    }
  };
  useEffect(() => {
    console.log('data',data)
    if(data?.city?.state?.id){
      dispatch(getCities(data?.city?.state?.id)).then((_data) => {
        setCities(_data);
      });
    }
  }, []);
  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
      <div className="cardContainer detailDrawer" style={{height:'100%'}}>
        <div className="detail-cardBox border-bottom-0 w-100 " style={{height:'100%'}}>
          <div className=" innerCardBox " style={{height:'100%'}}>
            <div className="d-flex justify-content-between align-items-center cardHeader noborder detailDrawer__cardHeader">
              <h4>{label}</h4>
              <div>
                {isLocked ? (
                  <CustomIcon className="d-inline-block px-2 cursor-pointer" icon="Edit/Stroke" onClick={() => setIsLocked(!isLocked)} />
                ) : (
                  <CustomIcon className="d-inline-block px-2 cursor-pointer" icon="Icon/Lock" onClick={() => setIsLocked(!isLocked)} />
                )}
                <CustomIcon onClick={toggleDrawer} className="d-inline-block px-2 cursor-pointer" icon="Close" />
              </div>
            </div>
            <div className="cardBody detailDrawer__cardBody">
              <div className="container-fluid">
                <div className="row">
                  {columns.map((detail) => (
                    <div
                      className={`${detail?.field?.fullWidth ? 'col-12' : 'col-6 px-0'} detailDrawer__text detailDrawer_margin-top-12px  `}
                      key={data['id']}
                    >
                      <div className="detailDrawer__field-label">{detail?.field?.label}</div>
                      {isLocked ? renderContent(detail) : renderContentEditable(detail)}
                    </div>
                  ))}
                  <div>
                    {/* Future used */}
                    {/* <div className="memberDetail__history w-100 pb-1 mb-2">
                      <div className="memberDetail__history-text">History </div>
                    </div>
                    <div className="memberDetail__history-list">
                      {historyMessageList.map((message) => (
                        <div className="memberDetail_font-size-13px" key={message}>
                          {ReactHtmlParser(message)}
                        </div>
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

DetailDrawer.propTypes = {
  label: PropTypes.string.isRequired,
  columns: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DetailDrawer;
