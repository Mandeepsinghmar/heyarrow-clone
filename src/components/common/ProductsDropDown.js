/* eslint-disable */
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from "react-loader-spinner";
import { connect, useDispatch } from 'react-redux';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
// import { getProducts } from '../../api/product';
import CustomIcon from './CustomIcon';

function ProductsDropDown(props) {
  const { isFilter = false, id = '', onSelect } = props;
  const [selected, setSelected] = useState('Select');
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const dispatch = useDispatch();

  useEffect(() => {
    fetchUsers();
  }, []);

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      fetchUsers(nextValue);
    }, 500),
    [] // will be created only once initially
  );

  const handleChange = (event) => {
    const { value: nextValue } = event.target;
    setPage(1);
    // highlight-starts
    debouncedSave(nextValue);
    // highlight-ends
  };

  /*
   * Getting Users list
   */
  const fetchUsers = (filter = '') => {
    setloading(true);
    let params = '&archived=false';
    if (filter) {
      params += `&search=${filter}`;
    }
    // dispatch(getProducts(page, params)).then((resp) => {
    //   if (resp && resp.length < 30) {
    //     setHasMore(false);
    //   }
    //   setloading(false);
    // });
  };

  const loadFunc = () => {
    if (!loading) {
      setPage(page + 1);
      fetchUsers();
    }
  };

  return (
    <div>
      <UncontrolledDropdown
        id={id}
        className="tableOptions dropdown_wrapper dropdown_wrapper_product"
      >
        <DropdownToggle>
          <div className="userCard d-flex">
            <div>{selected}</div>
          </div>
        </DropdownToggle>
        <DropdownMenu>
          {isFilter && (
            <div className="searchTabs">
              <CustomIcon icon="Search" />
              <input
                className="form-control"
                autoComplete="false"
                autoCapitalize="off"
                type="text"
                onChange={handleChange}
              />
            </div>
          )}
          <InfiniteScroll
            pageStart={page}
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
            {!loading && props.products.length > 0 ? (
              props.products.map((data, i) => (
                <DropdownItem
                  key={i}
                  onClick={() => {
                    onSelect({ target: { value: data.id } });
                    setSelected(`${data.machine} ${data.horsePower}HP ${data.modelName}`);
                  }}
                >
                  <div className="assignWrapper">
                    <div>
                      <div className="prodCard">
                        <div className="prodImg">
                          <img
                            src="https://picsum.photos/200/300"
                            alt="dummy-img"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="AdminproductDetail">
                      <div>
                        <h6 className="name">
                          {data.machine}
                          {' '}
                          {data.horsePower}
                          HP
                          {' '}
                          {data.modelName}
                        </h6>
                      </div>
                      <div>
                        <span className="position">
                          #hours #
                          {data.operationHours}
                          {' '}
                          {data.modelYear}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span>$150,000</span>
                    </div>
                  </div>
                </DropdownItem>
              ))
            ) : (
              <DropdownItem style={{ textAlign: 'center' }}>
                No record
              </DropdownItem>
            )}
          </InfiniteScroll>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}

const mapStateToProps = (state) => ({
  products: state.product.allProducts,
});

export default connect(mapStateToProps)(ProductsDropDown);
