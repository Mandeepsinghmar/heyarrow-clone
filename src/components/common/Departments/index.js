/* eslint-disable */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from "react-loader-spinner";
import CustomIcon from '../CustomIcon';
import { enableEditDepartment, disableEditDepartment, cancelDepartment, addNewDepartment } from '../../../redux/actions';
import { createDepartment, updateDepartment } from '../../../api/adminTeam';

function Departments(props) {
  const [isNewDepartment, setIsNewDepartment] = useState(false);
  const { preventDepartmentActivity = false } = props;
  const dispatch = useDispatch();

  const addNewDepartmentHandler = (value, index = false) => {
    const payload = { name: value };
    dispatch(createDepartment(payload, index));
  };

  const updateDepartmentHandler = (id, value, index) => {
    const payload = { name: value };
    dispatch(updateDepartment(id, payload, index));
  };

  const onKeyUpAdd = (e, i) => {
    if (e.keyCode === 13 || e.keyCode === 9) {
      addNewDepartmentHandler(e.target.value, i);
    }
  };

  const onBlurAdd = (e, i) => {
    if (e.target.value) {
      addNewDepartmentHandler(e.target.value, i);
    } else {
      dispatch(cancelDepartment(i));
    }
  };

  const onKeyUpUpdate = (item, e, i) => {
    if (e.keyCode === 13 || e.keyCode === 9) {
      updateDepartmentHandler(item.id, e.target.value, i);
    }
  };

  const renderDepartments = () => {
    if (props.loading) {
      return <div className="tableLoading ShowTableLoader" key={0}>
          <Loader
            type="Oval"
            color="#008080"
            height={30}
            width={30}
          />
        </div>
    }
      else {
      return (
        <ul className="listCon">
          <li
            className={`listItem ${props.filter === 'all' && 'active'}`}
            onClick={() => props.filterTeam('all')}
          >
            All
          </li>
          {props.adminTeamDepartmentList.map((item, i) => {
            return item.id === '' ? (
              <li className={'listItem'} key={i}>
                <div className="editDepartmentInput">
                  <input
                    className=""
                    type="text"
                    onKeyUp={(e) => onKeyUpAdd(e, i)}
                    onBlur={(e) => onBlurAdd(e, i)}
                  />
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => dispatch(cancelDepartment(i))}
                  >
                    <i className="fas fa fa-times"></i>
                  </span>
                </div>
              </li>
            ) : (
              <li
                style={{ cursor: 'pointer' }}
                className={`listItem ${props.filter === item.id && 'active'}`}
                key={i}
                onClick={() => props.filterTeam(item.id)}
              >
                {item.isEditing ? (
                  <div className="editDepartmentInput">
                    <input
                      className=""
                      type="text"
                      defaultValue={item.name}
                      placeholder="Enter Department name"
                      onKeyUp={(e) => onKeyUpUpdate(item, e, i)}
                    />
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => dispatch(disableEditDepartment(i))}
                    >
                      <i className="fas fa fa-times"></i>
                    </span>
                  </div>
                ) : (
                  item.name
                )}
                {!item.isEditing && !preventDepartmentActivity && (
                  <button type="button" className='sendBtn editRoleBtn' onClick={() => dispatch(enableEditDepartment(i))}>
                    <CustomIcon icon="Pen" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      );
    }
  };

  const addDepartment = () => {
    const emptyObj = { id: '', name: '' };
    dispatch(addNewDepartment(emptyObj));
  };

  return (
    <>
      <div className="cardHeader">
        <div className="d-flex justify-content-between">
          <div>
            <h4>Departments</h4>
          </div>
        </div>
        <button type="button" className="addNewItem noborder rolesAddIcon" onClick={() => addDepartment()}>
          <CustomIcon icon="Header/Icon/Add" />
        </button>
        {isNewDepartment && (
          <p>
            <div className="d-flex justify-between">
              <input
                className=""
                style={{ width: '85%' }}
                type="text"
                onKeyUp={(e) => {
                  if (e.keyCode === 13 || e.keyCode === 9) {
                    addNewDepartmentHandler(e.target.value);
                    setIsNewDepartment(false);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    addNewDepartmentHandler(e.target.value);
                    setIsNewDepartment(false);
                  }
                }}
              />
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => setIsNewDepartment(false)}
              >
                <i className="fas fa fa-times"></i>
              </span>
            </div>
          </p>
        )}
      </div>
      <div className="tableBox">
        {renderDepartments()}
        {!props.loading && !preventDepartmentActivity && (
          <div className="addNewItem noborder" onClick={() => addDepartment()}>
            <a className="add">+ Add department</a>
          </div>
        )}
      </div>
      <div className="bottomBtnCon">
        {props.OrgChart ? (
          <button
            className="btn"
            onClick={() => props.history.push('/admin/team')}
          >
            List View
          </button>
        ) : (
          <button
            className="btn"
            onClick={() => props.history.push('/admin/orgchart')}
          >
            Org-Chart View
          </button>
        )}
      </div>
    </>
  );
}

export default Departments;
