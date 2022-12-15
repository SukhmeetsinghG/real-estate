import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//Table columns
const columns = [
  {
    name: "Log ID",
    selector: (row) => row.logId,
    sortable: true,
  },
  {
    name: "Application Type",
    selector: (row) => row.applicationType ?? "-",
    sortable: true,
  },
  {
    name: "Application Id",
    selector: (row) => row.applicationId ?? "-",
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row.actionType ?? "-",
    sortable: true,
  },
  {
    name: "Action Details",
    selector: (row) => "-",
    sortable: true,
  },
  {
    name: "Date/Time",
    selector: (row) => row.creationTimestamp ?? "-",
    sortable: true,
  },
];

export default function App() {
  const [data, setData] = useState([]);
  const [oData, setOData] = useState([]);
  const [applicationTypes, setApplicationTypes] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams([]);
  const [params, setParams] = useState({
    logId: searchParams.get("logId") ?? "",
    applicationId: searchParams.get("applicationId") ?? "",
    applicationType: searchParams.get("applicationType") ?? "",
    actionType: searchParams.get("actionType") ?? "",
    formDate: searchParams.get("formDate") ?? "",
    toDate: searchParams.get("toDate") ?? "",
  });

  useEffect(() => {
    getData();
  }, []);

  //get data 
  async function getData() {
    await fetch("https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f")
      .then((res) => res.json())
      .then(
        (response) => {
          const resultData = response.result.auditLog;
          setData(resultData); //data to be fitered
          setOData(resultData); //data received from API
          console.log(resultData);
          //Dropdown values for application type column
          const applicationTypes = [
            ...new Set(resultData.map((item) => item.applicationType)),
          ];
          const distinctApplicationTypes = applicationTypes.filter((item) => {
            return item !== null;
          });
          setApplicationTypes(distinctApplicationTypes);

          //Dropdown values for action type column
          const actionTypes = [
            ...new Set(resultData.map((item) => item.actionType)),
          ];
          setActionTypes(actionTypes);

        },
        (error) => {
          alert(error);
        }
      );
    //console.log(data[0]);
  }

  //apply search filter
  const handleSearch = async () => {
    const arrFilters = [];
    if (
      params.logId != "" ||
      params.applicationType != "" ||
      params.applicationId != "" ||
      params.actionType != "" ||
      params.formDate != "" ||
      params.toDate != ""
    ) {
      if (params.logId != "") {
        arrFilters["logId"] = params.logId;
      }
      if (params.applicationType != "") {
        arrFilters["applicationType"] = params.applicationType;
      }
      if (params.applicationId != "") {
        arrFilters["applicationId"] = params.applicationId;
      }
      if (params.actionType != "") {
        arrFilters["actionType"] = params.actionType;
      }
      if (params.formDate != "" && !isNaN(params.formDate)) {
        arrFilters["formDate"] = new Date(params.formDate).getTime();
      }
      if (params.toDate != "" && !isNaN(params.toDate)) {
        arrFilters["toDate"] = new Date(params.toDate).getTime();
      }

      let fData = oData;
      let filterData = await fData.filter((item) => {
        let matchCount = 0;
        for (const [key, value] of Object.entries(arrFilters)) {

          if (key != "formDate" && key != "toDate") {
            if (item[key]?.toString().indexOf(value) > -1) {

              matchCount++;
            }
          } else {
            //for dates keys filter
            let logDate = new Date(item["creationTimestamp"]).getTime();
              if (key == "formDate") {
              if (logDate >= value) {
                matchCount++;
              }
            }
            if (key == "toDate") {
              if (logDate <= value) {
                matchCount++;
              }
            }
          }
        }
        if (Object.keys(arrFilters).length == matchCount) {
          return true;
        }
      });
      setData(filterData);
    } else {
      setParams({
        logId: "",
        applicationId: "",
        applicationType: "",
        actionType: "",
        fromDate: "",
        toDate: "",
      });
      setData(oData);
    }
  };

  useEffect(()=>{
    handleSearch()
  },[oData]);

  const handleChange = async (e) => {
    let obj = { ...params };
    obj[e.target.name] = e.target.value;
    setParams(obj);
  };

  return (
    <div className="py-5 paddingrl">
    <h1>Log List</h1>
      <form onSubmit={handleSearch} action="">
        <div className="row">
          <div className="form-group col-md-2">
            <label>Log Id</label>
            <input
              type="text"
              value={params.logId}
              name="logId"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group col-md-2">
            <label>Application Type</label>
            <select
              name="applicationType"
              className="form-control"
              onChange={handleChange}
            >
              <option value="">Select Application Type</option>
              {applicationTypes.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group col-md-2">
            <label>Application Id</label>
            <input
              type="text"
              value={params.applicationId}
              name="applicationId"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group col-md-2">
            <label>Action Type</label>
            <select
              name="actionType"
              className="form-control"
              onChange={handleChange}
            >
              <option value="">Select Action Type</option>
              {actionTypes.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group col-md-2">
            <label>From Date</label>
            <DatePicker
              className="form-control"
              selected={params.formDate}
              onChange={(date) => setParams({ ...params, formDate: date })}
              name="from_date"
            />
          </div>
          <div className="col-md-1">
            <label>To Date</label>
            <DatePicker
              className="form-control"
              selected={params.toDate}
              onChange={(date) => setParams({ ...params, toDate: date })}
              name="to_date"
            />
          </div>
          <div className="col-md-1 pt-4">
            <button type="button" onClick={handleSearch} className="searchAction btn btn-primary">
              Search
            </button>
          </div>
        </div>
      </form>

      <div className="card mt-2">
        <DataTable
          className="table table-striped table-bordered"
          columns={columns}
          data={data}
          pagination
          paginationPerPage={10}
        />
      </div>
    </div>
  );
}
