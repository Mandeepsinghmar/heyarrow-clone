import React from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import './index.scss';
import ProfileGroup from '../common/ProfileGroup';
import CustomIcon from '../common/CustomIcon';
import Loader from '../common/Loader';
import getFullName from '../../utils/getFullName';
import getLocation from '../../utils/getLocation';

const UserDetails = ({
  admin
}) => {
  const { data, loading } = useSelector((state) => state.team.memberDetails);
  return (
    <div className="customer-details">
      <h3>
        Details
      </h3>
      {loading ? <Loader secondary={admin} /> : (
        <>
          {data.id
            ? (
              <>
                <ProfileGroup
                  profiles={[
                    data,
                    data.reportingTo
                  ]}
                />
                <div className="customer-details__profile">
                  <h4>{getFullName(data)}</h4>
                  <span>{getLocation(data.city)}</span>
                </div>
                <div className="customer-details__buttons">
                  {data.email
                  && (
                    <Tooltip title={data.email}>
                      <a href={`mailto:${data.email}`}>
                        <IconButton size="small">
                          <CustomIcon icon="Icon/Email" />
                        </IconButton>
                      </a>
                    </Tooltip>
                  ) }
                  {data.phoneNumber
                    ? (
                      <Tooltip title={data.phoneNumber}>
                        <a href={`tel:${data.phoneNumber}`}>
                          <IconButton size="small">
                            <CustomIcon icon="Phone" />
                          </IconButton>
                        </a>
                      </Tooltip>
                    ) : null }
                </div>
              </>
            ) : <center>Contact not found!</center> }
        </>
      )}
    </div>
  );
};

UserDetails.propTypes = {
  admin: PropTypes.bool
};

UserDetails.defaultProps = {
  admin: false
};

export default UserDetails;
