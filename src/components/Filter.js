import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Filter(props) {
 const {params,setParams,applicationTypes,actionTypes,handleChange,NavigateTo} = props
  return (
    <form action="">
    <div className="d-flex">
      <div className="form-group px-2">
        <label>Log Id</label>
        <input
          type="text"
          value={params.logId}
          name="logId"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group px-2">
        <label>Application Type</label>
        <select
          name="applicationType"
          className="form-control"
          onChange={handleChange}
          value={params.applicationType}
        >
          <option value="">Select Application Type</option>
          {applicationTypes.map((item) => {
            return (
              <option key={item} value={item} >
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className="form-group px-2">
        <label>Application Id</label>
        <input
          type="text"
          value={params.applicationId}
          name="applicationId"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group px-2">
        <label>Action Type</label>
        <select
          name="actionType"
          className="form-control"
          onChange={handleChange}
          value={params.actionType}
        >
          <option value="">Select Action Type</option>
          {actionTypes.map((item) => {
            return (
              <option key={item} value={item} >
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className="form-group px-2 ">
        <label>From Date</label>
        <DatePicker
          className="form-control"
          selected={typeof params.fromDate === 'object' ? new Date(params.fromDate) : ''}

          onChange={(date) => setParams({ ...params, fromDate: date })}
          name="from_date"
        />
      </div>
      <div className="px-2">
        <label>To Date</label>
        <DatePicker
          className="form-control"
          selected={typeof params.toDate === 'object'  ? new Date(params.toDate) : ''}
          onChange={(date) => setParams({ ...params, toDate: date })}
          name="to_date"
        />
      </div>
      <div className="px-2 pt-4">
        <button type="button" onClick={NavigateTo} className="searchAction btn btn-primary">
          Search
        </button>
      </div>
    </div>
  </form>
  )
}
