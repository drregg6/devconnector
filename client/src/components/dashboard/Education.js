import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { connect } from 'react-redux';
import { deleteEdu } from '../../actions/profile';

const Education = ({ education, deleteEdu }) => {
  const educations = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className='hide-sm'>{edu.degree}</td>
      <td className='hide-sm'>
        <Moment format='YYYY/MM/DD'>{edu.from}</Moment> - {' '}
        {edu.current ?  (' Present') : (
          <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
        )}
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => deleteEdu(edu._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <React.Fragment>
      <h2 className='my-2'>Education</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>
          { educations }
        </tbody>
      </table>
    </React.Fragment>
  )
}

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEdu: PropTypes.func.isRequired
}

export default connect(
  null,
  { deleteEdu }
)(Education);