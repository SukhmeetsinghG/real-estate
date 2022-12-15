import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function User() {
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
    // handleSearch();

  }, []);

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

  const handleSearch = async () => {
    // e.preventDefault();
    // const filterKeys = [];
    const tst = [];

    if (
      params.logId != "" ||
      params.applicationType != "" ||
      params.applicationId != "" ||
      params.actionType != "" ||
      params.formDate != "" ||
      params.toDate != ""
    ) {
      if (params.logId != "") {
        tst["logId"] = params.logId;
      }
      if (params.applicationType != "") {
        tst["applicationType"] = params.applicationType;
      }
      if (params.applicationId != "") {
        tst["applicationId"] = params.applicationId;
      }
      if (params.actionType != "") {
        tst["actionType"] = params.actionType;
      }
      if (params.formDate != "" && !isNaN(params.formDate)) {
        tst["formDate"] = new Date(params.formDate).getTime();
      }
      if (params.toDate != "" && !isNaN(params.toDate)) {
        tst["toDate"] = new Date(params.toDate).getTime();
      }

      let fData = oData;
      let filterData = await fData.filter((item) => {
        let matchCount = 0;
        for (const [key, value] of Object.entries(tst)) {

          if (key != "formDate" && key != "toDate") {
            if (item[key]?.toString().indexOf(value) > -1) {

              matchCount++;
            }
          } else {
            // console.log(tst);
            //for dates keys filter
            let logDate = new Date(item["creationTimestamp"]).getTime();
              if (key == "formDate") {
              if (logDate >= value) {
                // console.log("fromDAt", value, value, logDate);

                matchCount++;
              }
            }
            if (key == "toDate") {
              if (logDate <= value) {
                // console.log("todate", value, value, logDate);

                matchCount++;
              }
            }
          }
        }
        // console.log("cond",Object.keys(tst).length,matchCount);
        if (Object.keys(tst).length == matchCount) {
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
    // console.log(e);
    obj[e.target.name] = e.target.value;
    setParams(obj);
  };

  return (
    <div className="container py-5">
      {/* <div className=''> */}
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
          <div className="col-md-2">
            <label>To Date</label>
            <DatePicker
              className="form-control"
              selected={params.toDate}
              onChange={(date) => setParams({ ...params, toDate: date })}
              name="to_date"
            />
          </div>
          <div className="col-md-2 pt-4">
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
    // </div>
  );
}
