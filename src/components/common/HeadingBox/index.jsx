import React from 'react';
// import { MONTHS, YEARS, QUARTERS } from '../../../../Constant';
import PropTypes from 'prop-types';
import CustomIcon from '../CustomIcon';
import './index.scss';

function HeadingBox(props) {
  const { title, tabs, noRightSection } = props;
  // const filter = useState(props.activeTab)
  //   const filter = useState(MONTHS);

  //   const renderSearchBar = () => {
  //     if (props.renderSelect) {
  //       switch (props.activeTab) {
  //         case 0: {
  //           filter = MONTHS;
  //           break;
  //         }
  //         case 1: {
  //           filter = QUARTERS;
  //           break;
  //         }
  //         case 2: {
  //           filter = YEARS;
  //           break;
  //         }
  //         default:
  //           break;
  //       }
  //       return (
  //         <div
  //           className="selecBox"
  //           style={
  //             props.renderSelectOnRight && {
  //               order: 1,
  //               marginRight: 0,
  //               marginLeft: 10,
  //             }
  //           }
  //         >
  //           <select className="form-control"
  //            onChange={props.onChangeDuration}>
  //             {filter.map((item) => (
  //               <option
  //                 key={item.value}
  //                 value={item.value}
  //                 style={{ fontSize: '15px', fontFamily: 'inherit' }}
  //               >
  //                 {item.label}
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //       );
  //     }
  //   };
  return (
    <div className="headingBox headingToggle">
      {title ? (
        <div className="leftBar">
          <h5>{title}</h5>
        </div>
      ) : null}

      <div className="centerBar">
        {/* {renderSearchBar()} */}
        <ul>
          {tabs.map((item, index) => (
            <li
              className={(props.activeTab === index && 'active') || ''}
              onClick={() => props.onChangeTab(index)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      {!noRightSection ? (
        <div className="rightBar">
          <CustomIcon icon="Search" />
        </div>
      ) : null}
    </div>
  );
}

HeadingBox.propTypes = {
  tabs: PropTypes.func.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  noRightSection: PropTypes.bool.isRequired
};

export default HeadingBox;
