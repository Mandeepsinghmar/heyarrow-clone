/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import SearchInput from '../common/SearchInput';
import { useDispatch } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import CustomIcon from './CustomIcon';
import { clearAdminProducts } from '../../redux/actions';
import { getAdminProductsList } from '../../api/adminProducts';

export default function CustomeDropDown(props) {
  const { options, isFilter = false, id = '', name, onSelect, valueFeild, readOnly, placeholder = '', selectedId } = props;
  const [loading, setloading] = useState(false);
  const [filtered, setFiltered] = useState(options);
  const [selected, setSelected] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [limit] = useState(30);
  const [height, setHeight] = useState(window.innerHeight);
  const [hasMore, setHasMore] = useState(true);
  const debouncedSave = useCallback(
    debounce((nextValue) => {
      dispatch(clearAdminProducts());
      fetchProducts(nextValue);
    }, 1000),
    []
  );
  const handleChange = (event) => {
    setPage(1);
    setSearch(event);
    debouncedSave(event);
  };
  useEffect(() => {
    setHeight(window.innerHeight);
    setFiltered(options);
  }, [options]);

  useEffect(() => {
    // if (props.selectedValue && selected === 'Select') {
    //   setSelected(props.selectedValue)
    // }
  }, []);

  const fetchProducts = (nextValue) => {
    setloading(true);
    dispatch(getAdminProductsList(height >= 900 ? limit * 3 : limit, page, nextValue && `&search=${nextValue}`)).then((res) => {
      setloading(false);
      setPage(page + 1);
      if (res && res.length < 30) {
        setHasMore(false);
      }
    });
  };

  const filterData = (search) => {
    if (search !== '') {
      const temp = [];
      options.map((o) => {
        if (o[name].toLowerCase().includes(search.toLowerCase())) {
          temp.push(o);
        }
      });
      setFiltered(temp);
    } else {
      setFiltered(options);
    }
  };

  const renderLabel = () => {
    if (selected) {
      return selected;
    }
    if (props.selectedValue) {
      return props.selectedValue;
    }
    return <span style={{ color: 'rgb(112, 117, 128)' }}>{!readOnly ? placeholder : '-'}</span>;
  };

  return (
    <div style={{ width: '100px' }}>
      {readOnly ? (
        renderLabel()
      ) : (
        <UncontrolledDropdown
          id={id}
          className={!selected && !props.selectedValue ? 'tableOptions dropdown_wrapper selectbox' : 'tableOptions dropdown_wrapper'}
        >
          <DropdownToggle>{renderLabel()}</DropdownToggle>
          <DropdownMenu>
            {isFilter && (
              <div className="searchInputBar">
                <SearchInput onChange={(e) => filterData(e.target.value, name)} onClear={() => handleChange('')} />
              </div>
            )}
            {options.length > 0 && filtered.length > 0 ? (
              filtered.map((data, i) => (
                <DropdownItem
                  key={i}
                  onClick={() => {
                    setSelected(data[name]);
                    onSelect({ target: { value: data[valueFeild] } });
                  }}
                >
                  {data[name]}
                </DropdownItem>
              ))
            ) : (
              <DropdownItem>No record</DropdownItem>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </div>
  );
}
