/* eslint-disable */
import React, { useState } from 'react';

function SideDrawer(props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? 'opened' : ''}>
      <button className="sideDrawerBtn" style={{ background: '#EDEFF2', borderRadius: 4 }} onClick={() => setOpen(!open)}>
        <i className="fas fa-clock" />
      </button>
      <div className="sideDrawerCon">
        <button className="sideDrawerBtn" onClick={() => setOpen(!open)} style={{float: 'right'}}>
          <i className="fas fa-times"></i>
        </button>
        <div className="innerDrawerCon">
          <h4>Log History</h4>
          <ul>
            {props.logs && props.logs.map((data) => (
              <li>
                {`${data.user.firstName} ${data.user.lastName} ${data.log}`}
                <span>07/20/2020</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideDrawer;
