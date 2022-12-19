import React, { useState, useEffect } from "react";
import Filter from './Filter'
import DataTable from "react-data-table-component";
import { useSearchParams , useNavigate} from "react-router-dom";

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
      cell: row => <div data-tag="allowRowEvents" data-order={row.applicationType ?? "-1"}>{row.applicationType ?? "-"}</div>,
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

export default function LogList() {
    const navigate = useNavigate();
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
      fromDate: searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")) : '',
      toDate:  searchParams.get("toDate") ? new Date(searchParams.get("toDate")) : '',
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
      }


  //apply search filter
  const handleSearch = async () => {
    const arrFilters = [];
    if (
      params.logId !== "" ||
      params.applicationType !== "" ||
      params.applicationId !== "" ||
      params.actionType !== "" ||
      params.fromDate !== "" ||
      params.toDate !== ""
    ) {
      if (params.logId !== "") {
        arrFilters["logId"] = params.logId;
      }
      if (params.applicationType !== "") {
        arrFilters["applicationType"] = params.applicationType;
      }
      if (params.applicationId !== "") {
        arrFilters["applicationId"] = params.applicationId;
      }
      if (params.actionType !== "") {
        arrFilters["actionType"] = params.actionType;
      }
      if (params.fromDate !== "" && !isNaN(params.fromDate)) {
        arrFilters["fromDate"] = new Date(params.fromDate).getTime();
      }
      if (params.toDate !== "" && !isNaN(params.toDate)) {
        arrFilters["toDate"] = new Date(params.toDate).getTime();
      }

      let fData = oData;
      let filterData = await fData.filter((item) => {
        let matchCount = 0;
        for (const [key, value] of Object.entries(arrFilters)) {

          if (key !== "fromDate" && key !== "toDate" && key !== "applicationType" && key !== "actionType") {
            if (item[key]?.toString().indexOf(value) > -1) {

              matchCount++;
            }
          }else if(key === "applicationType" || key === "actionType") {
            if(item[key]?.toString() === value)
            {
              matchCount++;
            }

          } else {
            //for dates keys filter
            let logDate = new Date(item["creationTimestamp"]).getTime();
              if (key === "fromDate") {
              if (logDate >= value) {
                matchCount++;
              }
            }
            if (key === "toDate") {
              if (logDate <= value) {
                matchCount++;
              }
            }
          }
        }
        if (Object.keys(arrFilters).length === matchCount) {
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


  //set input values
  const handleChange = async (e) => {
    let obj = { ...params };
    obj[e.target.name] = e.target.value;
    setParams(obj);
  }

  const NavigateTo = async() =>{
    let urlStr = '?';
    for (let [key, value] of Object.entries(params)) {
      if(value.length > 0  || (key  === 'fromDate') || (key === 'toDate'))
      {
        if((key === 'fromDate' || key === 'toDate'))
        {
          if(value){
            const dt = new Date(value);
            value = (dt.getMonth()+1)+"/"+dt.getDate()+"/"+dt.getFullYear();
          }
        }

        if(value.length > 0)
        {
          if(urlStr.length === 1 && urlStr === '?')
          {
            urlStr = urlStr +key+"="+value;
          }else{
            urlStr = urlStr + '&'+key+"="+value;
          }  
        }
        // console.log(value)
      }
    }
    navigate("/"+urlStr);
    // window.location.reload(false);
    handleSearch()
  }


    return (
    <div className="py-5 paddingrl">
    <h1>Log List</h1>
    <Filter params={params} setParams = {setParams} applicationTypes={applicationTypes} actionTypes={actionTypes} handleChange = {handleChange} NavigateTo = {NavigateTo}/>
      <hr className="my-4"/>
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
  )
}
