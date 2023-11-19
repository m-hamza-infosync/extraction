import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";


const ExtractorTable = (props) => {
  const [token, setToken] = useState("");


  const [tableDataStats, setTableDataStats] = useState({
    isLoading: true,
    data: []
  })

  const apiExample = 'http://139.144.30.86:8000/api/stats?job=Extractor&uid=uiEZHND3DxfKMndj6iI2YSYiKZQ2'

  const [tableData, setTableData] = useState({
    isLoading: true,
    data: []
  })

  const [searchByID, setSearchByID] = useState("");
  const [filterByQAStatus, setFilterByQAStatus] = useState("qa-status");



  useEffect(() => {

    const lt = (new Date().getTime() / 1000).toFixed(0)
    const apiURL = `http://139.144.30.86:8000/api/super_table?job=Extractor&lt=${lt}&gt=0&page=0&uid=${props.user.uid}`
    fetch(apiURL).then(res => res.json()).then((result) => {
      console.log(result);
      setTableData(pre => ({
        ...pre,
        data: result.data
      }))

      setTableDataStats(pre => ({
        ...pre,
        data: result.data
      }))
    })


  }, []);

  const getStats = () => {
    const attempted = tableDataStats.data.length;

    var rejected_nad = 0;
    var under_qa = 0;
    var minor = 0;
    var major = 0;
    var passed = 0;
    var earnings = 0;



    tableDataStats.data.map((item) => {
      if (item.status === "under_qa" || item.status === null) {
        under_qa++;
      } else if (item.status === "passed") {
        passed++;
      } else if (item.status === "minor") {
        minor++;
      } else if (item.status === "major") {
        major++;
      } else if (item.status === 'rejected_nad') {
        rejected_nad++;
      }

      if (item.earning && item.earning !== 'N/A') {
        earnings = earnings + parseInt(item.earning)
      }
    })

    return [
      attempted,
      rejected_nad,
      under_qa,
      minor,
      major,
      passed,
      earnings
    ]
  }

  const getAllProductsByFilter = () => {

    var products = tableData.data;

    if (searchByID !== '') {
      products = products.filter((item) => item.productID.includes(searchByID))
    }

    if (filterByQAStatus !== 'qa-status') {
      products = products.filter((item) => item.status === filterByQAStatus)
    }

    return products
  }

  return (
    <>
      <div>
        <h2>Stats Overview</h2>
        <div className="d-flex flex-row justify-content-end gap-2">
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ border: "2px solid #e8e8e8" }}>
            <h6 className="m-0 py-1">Starting Date</h6>
            <input className="px-3" type="date" style={{ backgroundColor: "#e8e8e8" }} />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ border: "2px solid #e8e8e8" }}>
            <h6 className="m-0 py-1">Ending Date</h6>
            <input className="px-3" type="date" style={{ backgroundColor: "#e8e8e8" }} />
          </div>
          <button className="btn btn-fetch">Submit</button>
        </div>
        <table className="table mt-4 table-bordered table-striped align-middle text-center">
          <thead className="table-info">
            <tr>
              <th>Attempted</th>
              <th>Not a Doable</th>
              <th>Under QA</th>
              <th>MINOR [QA Passed]</th>
              <th>MAJOR [QA Passed]</th>
              <th>100% [QA Passed]</th>
              <th>Earnings</th>
            </tr>
          </thead>
          <tbody>
            <tr tr>
              {getStats().map((item, index) => {
                return <td>{item}</td>
              })}
            </tr>
          </tbody>
        </table>
      </div >
      <div className="mt-5">
        <h2>All Products Overview</h2>
        <div className="d-flex flex-row justify-content-end gap-2">
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ border: "2px solid #e8e8e8" }}>
            <h6 className="m-0 py-1">Starting Date</h6>
            <input className="px-3" type="date" style={{ backgroundColor: "#e8e8e8" }} />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ border: "2px solid #e8e8e8" }}>
            <h6 className="m-0 py-1">Ending Date</h6>
            <input className="px-3" type="date" style={{ backgroundColor: "#e8e8e8" }} />
          </div>
          <button className="btn btn-fetch">Submit</button>
        </div>
        <table className="table mt-4 table-bordered table-striped align-middle text-center">
          <thead className="table-dark">
            <tr className="border-0 bg-white">
              <th colSpan={2} className="bg-white text-dark border-0">
                {getAllProductsByFilter().length} Results Found
              </th>
              <th className="bg-white" style={{ maxWidth: 150 }}>
                <div className="d-flex flex-row">
                  <input
                    className="p-2 w-100"
                    type="text"
                    placeholder="Search by ProductID"
                    style={{ backgroundColor: "#e8e8e8", width: "fit-content" }}
                    onChange={(e) => setSearchByID(e.target.value)}
                    value={searchByID}
                  />
                  <button className="btn btn-go-fetch" onClick={() => setSearchByID("")}>Clear</button>
                </div>
              </th>
              <th className="bg-white"></th>
              <th className="bg-white"></th>
              <th className="bg-white">

                <select
                  className="p-2 w-100"
                  name="qa-status"
                  id="qa-status"
                  onChange={(e) => setFilterByQAStatus(e.target.value)}
                  value={filterByQAStatus}
                >
                  <option value="qa-status">Filter by QA Status</option>
                  <option value="under_qa">Under QA</option>
                  <option value="passed">100% [QA Passed]</option>
                  <option value="minor">MINOR[QA Passed]</option>
                  <option value="major">MAJOR [QA Passed]</option>
                </select>

              </th>
            </tr>
            <tr>
              <th># SR</th>
              <th>Thumbnail</th>
              <th>Product ID</th>
              <th>Variant ID</th>
              <th>Extraction Date & Time</th>
              <th>QA Status</th>
              <th>Earning</th>
            </tr>
          </thead>
          <tbody>
            {getAllProductsByFilter().length === 0 && <tr>
              <td colSpan={6}>
                <h4 className="text-center p-2 w-100">0 Results</h4>
              </td>
            </tr>}
            {getAllProductsByFilter().map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img src={item.thumbnail} alt="" height="52px" />
                </td>
                <td>{item.productID}</td>
                <td>{item.variantID}</td>
                <td>{formatDate(item.lastModified)}</td>
                <td>{item.status === 'under_qa' ? 'Under QA' : item.status === 'not_understandable' ? 'Not Understandable' : item.status === 'minor' ? 'MINOR [QA Passed]' : item.status === 'major' ? 'MAJOR [QA Passed]' : item.status === 'passed' ? '100% [QA Passed]' : 'N/A'}</td>
                <td>{item.earning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div >

      <nav>
        <ul class="pagination">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1">Previous</a>
          </li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item active">
            <a class="page-link" href="#">2</a>
          </li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item">
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>

    </>
  );
};

export default ExtractorTable;


// {
//   isLoading: true,
//   data: [
//     {
//       thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
//       productID: "1122233",
//       varientID: "3982435",
//       extractionTimeStamp: "2023-11-12T15:25:16+00:00",
//       QAStatus: "passed",
//       Earning: 8
//     },
//     {
//       thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
//       productID: "1122233",
//       varientID: "3982435",
//       extractionTimeStamp: "2023-11-12T15:25:16+00:00",
//       QAStatus: "minor",
//       Earning: 6
//     },
//     {
//       thumbnail: "https://assets.wfcdn.com/im/19503566/resize-h755-w755%5Ecompr-r85/1971/197195106/2+Piece.jpg",
//       productID: "123423",
//       varientID: "3982435",
//       extractionTimeStamp: "2023-11-12T15:25:16+00:00",
//       QAStatus: "under_qa",
//       Earning: 'N/A'
//     }
//   ]
// }