/* eslint-disable */
import React, { useState } from 'react';
import { get, isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import dropDownSelectors from './tablelUtils/dropDownProps';
import CustomDropDown from '../CustomeDropDown';
import AssignToDropDown from '../AssignToDropDown';
import CountryCodeDropDown from '../CountryCodeDropDown';
import ProductsDropDown from '../ProductsDropDown';
import { getCities } from '../../../api/common';
import StatesDropDown from '../StatesDropDown';
import CitiesDropDown from '../CitiesDropDown';
import reformatNumber from '../../../utils/reformatNumber';
import TableSendButton from '../TableSendButton';
import DatePicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import OptionsDropDown from './optionsDropDown';
import formatter from '../../../utils/moneyFormatter';
import ProfileInitial from '../ProfileInitials';
import BadgePipelineAutomation from '../BadgePipelineAutomation';
import "react-datepicker/dist/react-datepicker.css";

const loadedStates = [];

export const RenderTableCell = ({
    // noEditing=true,
    noEditingEmail,
    value,
    columnKey: key,
    type,
    options,
    innerKey,
    item,
    index,
    label,
    read,
    isEmail,
    readOnly=false,
    optionsToChooseFrom,
    onChange,
    onSave,
    assignSalesRepHandler,
    assignReportToHandler,
}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [stateId, setStateId] = useState(null);
    const [countryId, setCountryId] = useState(1);
    const { client } = useSelector((state) => state);

    const dispatch = useDispatch();

    !readOnly && client.domain == 'cbops' && !isEmpty(item.refId) ? readOnly = true : null;

    const fetchInitialCites = (stateId) => {
      if (!loadedStates.find((state) => state === stateId)) {
        dispatch(getCities(stateId));
        loadedStates.push(stateId);
      }
    };

  const onSelectProducts = (data) => {
    onChange(data, key, item, index);
  }

  const onSelectCities = (e) => {
    if(!item.isNewItem) {
      onSave(item, index, { [key]: e.target.value });
    }
    onChange(e, key, item, index);
  }

  const onSelectStatesDropDown = (e) => {
    if(!item.isNewItem) {
      onSave(item, index, { [key]: e.target.value });
    }
    setStateId(e.target.value);
    onChange(e, key, item, index);
    onChange({ target: { value: '' } }, 'city', item, index);
    onChange(
      { target: { value: '' } },
      'cityId',
      item,
      index
    );
    }

    const onSelectAssignTo = (data) =>{
      if (!item.isNewItem) {
        type === 'reportTo'
          ? assignReportToHandler(item.id, data.target.value)
          : assignSalesRepHandler(item.id, data.target.value);
      }
      else {
        type === 'reportTo'
          ? onChange(data, 'reportingToId', item, index)
          : onChange(data, 'assignedTo', item, index);
      }
      onChange(data, key, item, index);
    }

    const onKeyDownInput = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        onSave(item, index, {
          [key]: type === 'phone' && reformatNumber(e.target.value) || (e.target.value).replace('$', '').replace(/,/g, ''),
        });
      }
    }

    const onBlur = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (item.id) {
        onSave(item, index, { [key]: type == 'phone' && reformatNumber(e.target.value) || (e.target.value).replace('$', '').replace(/,/g, '') });
      }
    }

    if (item.isNewItem) {
        const properties = dropDownSelectors(item, type, key)
        if (type === 'date') {
          return (
            <DatePicker
              className={readOnly ? 'outline-none showPointer' : 'form-control showPointer'}
              dateFormat="MM/dd/yyyy"
              selected={startDate}
              onChange={(date) => {
                onChange({ target: { value: date } }, key, item, index);
                setStartDate(date);
              }}
              readOnly={readOnly}
            />
          );
        } if (type === null) {
          return '-';
        } if (type === 'phone') {
          return (
            <CountryCodeDropDown
              isFilter={true}
              name={label}
              value={value}
              item={item}
              index={index}
              change={(e) => {
                if (isNaN(reformatNumber(e.target.value))) {
                  e.preventDefault();
                  return false;
                }
                onChange(e);
              }}
              onBlur={(e, countryCode) => onBlur(e)}
              onKeyDown={(e, countryCode) => onKeyDownInput(e)}
              onChange={(e, countryCode) => {
                onChange(e, key, item, index);
              }}
              options={JSON.parse(JSON.stringify(optionsToChooseFrom[options]))}
            />
          );
        } if (['country', 'customDropdown', 'role', 'department', 'year', 'status'].includes(type)) {
          return (
            <CustomDropDown
              isFilter={properties.isFilter}
              name={properties.feildName}
              type={type}
              item={item}
              valueFeild={properties.valueFeild}
              options={JSON.parse(JSON.stringify(optionsToChooseFrom[options]))}
              onSelect={(e) => {
                value == undefined &&
                  onSave(item, index, { [key]: [e.target.value] });
                onChange(e, key, item, index);
              }}
              selectedValue={readOnly ? properties.selectedValue : properties.selectedValue ? properties.selectedValue : 'Select'}
              selectedId={value}
            />
          );
        } if (type === 'state') {
          return (
            <StatesDropDown
              key={index}
              isFilter={true}
              countryId={countryId}
              index={index}
              onSelect={(e) => onSelectStatesDropDown(e)}
              selectedValue={properties.selectedValue}
              selectedId={item[key]}
            />
          );
        } if (type === 'city') {
          return (
            <CitiesDropDown
              key={index}
              isFilter={properties.isFilter}
              item={item}
              index={index}
              stateId={stateId}
              onSelect={(e) => onSelectCities(e)}
              selectedValue={properties.selectedValue}
              selectedId={item[key]}
              fetchInitialCites={fetchInitialCites}
            />
          );
        } if (type === 'salesRepId') {
          return (
            <AssignToDropDown
              isFilter={true}
              onSelect={(data) => onSelectAssignTo(data)}
              readOnly={readOnly}
              selectedSalesRep={item['salesRep']} // BUG EXPECTED HERE
            />
          );
        } if (type === 'product') {
          return (
            <ProductsDropDown
              isFilter={true}
              onSelect={(data) => onSelectProducts(data)}
            />
          );
        } if (type === 'reportTo') {
          return (
            <AssignToDropDown
              isFilter={properties.isFilter}
              readOnly={readOnly}
              onSelect={(data) => onSelectAssignTo(data)}
              selectedSalesRep={item['reportingTo']}
            />
          );
        } if (options) {
          return (
            <OptionsDropDown
              options={options}
              optionsToChooseFrom={optionsToChooseFrom}
              key={key}
              index={index}
              isNewItem={item.isNewItem}
              value={value}/>
          );
        } if(type === 'type') {
          const currentYear = new Date().getFullYear();
          return item.modelYear
            ? item.modelYear >= currentYear
              ? 'New' : 'Used'
            : <div style={{ width: 100 }}>-</div>
        }
        return (
          <input
            type={isEmail ? 'email' : 'text'}
            className="form-control"
            style={{ display: 'inline-block' }}
            placeholder={label}
            onKeyDown={(e) => onKeyDownInput(e)}
            onChange={(e) => {
              onChange(e, key, item, index)
            }}
            value={value}
          />
        );
    } else {
      if (item.email && noEditingEmail) {
        return type === 'email' && value;
      } else if (innerKey) {
        return item[key] && item[key].length ? item[key][0][innerKey] : '';
      } else if (type === 'date') {
        return !item[key] ?
         (<span>-</span>)
        : (
          <DatePicker
            className={readOnly ? 'outline-none showPointer' : 'editingInput showPointer'}
            dateFormat="MM/dd/yyyy"
            selected={new Date(item[key])}
            onChange={(date) => {
              onChange({ target: { value: date } }, key, item, index);
              setStartDate(date);
            }}
            readOnly={readOnly}
          />
        );
      } else if (type === null) {
        return '-';
      } else if (type === 'phone') {
        return (
          <CountryCodeDropDown
            isFilter={true}
            isEdit={true}
            name="label"
            readOnly={readOnly}
            value={value || ''}
            change={(e) => {
              if (isNaN(reformatNumber(e.target.value))) {
                e.preventDefault();
                return false;
              }
              onChange(e);
            }}
            options={optionsToChooseFrom[options]}
            onBlur={(e, countryCode) =>onBlur(e)}
            onKeyDown={(e, countryCode) => onKeyDownInput(e)}
            onChange={(e, countryCode) => {
              onChange(e, key, { ...item, countryCode }, index);
            }}
            item={item || ''}
          />
        );
      } else if (['country', 'customDropdown', 'role', 'department', 'year', 'status'].includes(type)) {
        const properties = dropDownSelectors(item, type, key);
        return (
          <CustomDropDown
            readOnly={readOnly}
            isFilter={properties.isFilter}
            name={properties.feildName}
            valueFeild={properties.valueFeild}
            item={item}
            options={JSON.parse(JSON.stringify(optionsToChooseFrom[options]))}
            onSelect={(e) => {
              onSave(item, index, { [key]: e.target.value });
              onChange(e, key, item, index);
              // type === 'department' && props.assignDepartmentHandler({ userId: item.id, departmentId: e.target.value })
            }}
            selectedId={value}
            selectedValue={readOnly ? properties.selectedValue : properties.selectedValue ? properties.selectedValue : 'Select'  }
          />
        );
      } else if (type === 'state') {
        return (
          <StatesDropDown
            key={index}
            readOnly={readOnly}
            isFilter={true}
            countryId={countryId}
            index={index}
            onSelect={(e) => onSelectStatesDropDown(e)}
            selectedValue={get(item, 'city.state.name')}
            selectedId={item[key]}
          />
        );
      } else if (type == 'via') {
        return (
          <a href={'mailto: ' + item?.email || ''}>
            <TableSendButton
              className="sendBtn"
              title=""
              icon="Icon/Email"
            />
          </a>
      )} else if (type === 'city') {
        return (
          <CitiesDropDown
            key={index}
            readOnly={readOnly}
            isFilter={true}
            item={item}
            index={index}
            onSelect={(e) => onSelectCities(e)}
            selectedValue={get(item, 'city.name')}
            selectedId={item[key]}
            fetchInitialCites={fetchInitialCites}
          />
        );
      } else if (['salesRepId', 'reportTo'].includes(type)){
        return (
          <AssignToDropDown
            isFilter={true}
            readOnly={readOnly}
            onSelect={(data) => onSelectAssignTo(data)}
            selectedSalesRep={type==='reportTo' && item['reportingTo'] || item['salesRep']}
          />
        )
      } else if (type === 'product') {
        return (
          <ProductsDropDown
            isFilter={true}
            onSelect={(data) => onSelectProducts(data)}
          />
        );
      }
      else if (type === 'reportTo') {
        return (
          <AssignToDropDown
            isFilter={properties.isFilter}
            readOnly={readOnly}
            onSelect={(data) => onSelectAssignTo(data)}
            selectedSalesRep={item['reportingTo']}
          />
        );
      }
      else if (['price', 'currency'].includes(type)) {
        const priceVal = formatter.format(value);
        return readOnly ? (
          priceVal
        ) : (
          <input
            type="text"
            placeholder={label}
            readOnly={readOnly}
            value={priceVal}
            className="editingInput"
            onChange={(e) => {
              onChange(e, key, item, index);
            }}
            onKeyDown={(e) => onKeyDownInput(e)}
            onBlur={(e) => onBlur(e)}
          />
        );
      } else if (options) {
        return (<OptionsDropDown
                  options={options}
                  optionsToChooseFrom={optionsToChooseFrom}
                  key={key}
                  index={index}
                  isNewItem={item.isNewItem}
                  value={value}/>
        );
      } else if (type === 'type') {
        const currentYear = new Date().getFullYear();
        return item.modelYear >= currentYear ? <div style={{ width: 100 }}>New</div> : <div style={{ width: 100 }}>Used</div>
      } else if (type === 'team_member') {
        const fullName = item.teamMember?.split(' ')?.filter(val => val != "");
        if (value) {
          return (
            <div className="userCard" style={{ margin: 0 }}>
              <div className="userCon custom-init-icon">
                <ProfileInitial firstName={fullName[0]} lastName={fullName[1]} size="small" profileId={item.id} />
              </div>
              {value}
            </div>
          );
        }
        return <></>
      }
      else if(type === 'zipcode'){
     return <input
            type="number"
            readOnly={readOnly}
            placeholder={label}
            value={value || ''}
            className="editingInput"
            onChange={(e) => {
              onChange(e, key, item, index);
            }}
            onKeyDown={(e) => onKeyDownInput(e)}
            onBlur={(e) => onBlur(e)}
          />
      }
      else if(type === 'totPurchased'){
        return <span>
      {value ? value : '-'}
        </span>
         }
        else if(type === 'badgePipeline'){
        return <BadgePipelineAutomation text={value.text} type={value.type} />
          }
          else if(type === 'select'){
            return     (value ?   <select
              style={{background: '#F2F3F5', maxWidth: 150, fontSize: 13, }}
              className="form-control"
            >
              {value && value.map(value => (
                <option value={value.id}>
                  {value.name}
                </option>
              ))}
            </select> : <span />
            )
              }
       else {
        return readOnly ? (
          value && typeof value === 'object' && Object.keys(value).length > 0 ?
            <span className={value.cellClass}>{value.value}</span>
            : <span>{value ? value : '-'}</span>
        ) : (
          <input
            type={isEmail ? 'email' : 'text'}
            readOnly={readOnly}
            placeholder={label}
            value={value || ''}
            className="editingInput"
            onChange={(e) => {
              onChange(e, key, item, index);
            }}
            onKeyDown={(e) => onKeyDownInput(e)}
            onBlur={(e) => onBlur(e)}
          />
        );
      }
    }
  };

RenderTableCell.propTypes = {
  noEditing: PropTypes.any,
  noEditingEmail: PropTypes.any,
  value: PropTypes.any,
  columnKey: PropTypes.string,
  type: PropTypes.string,
  options: PropTypes.array,
  innerKey: PropTypes.any,
  item: PropTypes.object,
  index: PropTypes.any,
  label: PropTypes.string,
  read: PropTypes.any,
  isEmail: PropTypes.bool,
  readOnly: PropTypes.bool,

  onSave: PropTypes.func,
  onChange: PropTypes.func,
  assignReportToHandler: PropTypes.func,
  assignSalesRepHandler: PropTypes.func
};