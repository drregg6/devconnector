import React from 'react';

const NotFound = () => {
  return (
    <React.Fragment>
      <h1 className="x-large text-primary">
        <i className="fas fa-exclamation-triangle"></i> Page Not Found
      </h1>
      <p className="large">Sorry, this page does not exist.</p>
    </React.Fragment>
  )
}

export default NotFound;