import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class FilterData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterList: [
        { value: 'Email', id: 'email' },
        { value: 'Text', id: 'text' },
        { value: 'Social Post', id: 'social_post' },
        { value: 'Social Ad', id: 'social_ad' },
        { value: 'Search Ad', id: 'searchad' }
      ],
      activeFilter: [],
      FilterCheckedList: [],
      onSearchHandler: props.onSearchHandler
    };
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  onFilterChange(event) {
    const { activeFilter, FilterCheckedList, onSearchHandler } = this.state;
    const index = FilterCheckedList.indexOf(event.target.value);
    if (event.target.checked) {
      FilterCheckedList.push(event.target.value);
    } else if (index !== -1) {
      FilterCheckedList.splice(index, 1);
    }
    if (activeFilter.includes(event.target.value)) {
      const filterIndex = activeFilter.indexOf(event.target.value);
      const newFilter = [...activeFilter];
      newFilter.splice(filterIndex, 1);
      this.setState({ activeFilter: newFilter });
    } else {
      this.setState({ activeFilter: [...activeFilter, event.target.value] });
    }
    onSearchHandler(FilterCheckedList);
  }

  render() {
    const { filterList, activeFilter } = this.state;
    return (
      <div className="filtercontainer">
        <div className="filteritems">
          {filterList.map((filter) => (
            <div>
              {activeFilter.includes(filter.id)
                ? <label className="checkbox-label custom-select-label" htmlFor={filter.label} style={{ fontWeight: 'bold' }}>{filter.value}</label>
                : <label className="checkbox-label custom-select-label" htmlFor={filter.label}>{filter.value}</label>}
              <input
                className="checkboxlist"
                id={filter.id}
                value={filter.id}
                type="checkbox"
                onClick={this.onFilterChange}
                style={{ backgroundColor: 'red' }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
FilterData.propTypes = {
  onSearchHandler: PropTypes.func
};

FilterData.defaultProps = {
  onSearchHandler: () => {}
};
export default FilterData;
