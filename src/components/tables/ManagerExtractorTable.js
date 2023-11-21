import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";


const ManagerExtractorTable = (props) => {
    const [token, setToken] = useState("");

    const lt = (new Date().getTime() / 1000).toFixed(0)

    const [tableDataStats, setTableDataStats] = useState({
        isLoading: true,
        lessThanDate: lt,
        greaterThanDate: 0,
        currentPage: 0,
        totalPages: 1,
        reset: 0,
        data: []
    })

    const [tableData, setTableData] = useState({
        isLoading: true,
        lessThanDate: lt,
        greaterThanDate: 0,
        currentPage: 0,
        totalPages: 1,
        reset: 0,
        data: []
    })

    const [searchByID, setSearchByID] = useState("");
    const [filterByQAStatus, setFilterByQAStatus] = useState("qa-status");

    const fetchTableDataStats = () => {
        setTableDataStats(pre => ({
            ...pre,
            isLoading: true
        }))
        const apiURL = `http://139.144.30.86:8000/api/super_table?job=Extractor&lt=${tableDataStats.lessThanDate}&gt=${tableDataStats.greaterThanDate}&page=${tableDataStats.currentPage}`
        fetch(apiURL).then(res => res.json()).then((result) => {
            setTableDataStats(pre => ({
                ...pre,
                isLoading: false,
                data: result.data
            }))
        })
    }

    const fetchTableData = () => {
        setTableData(pre => ({
            ...pre,
            isLoading: true
        }))
        const apiURL = `http://139.144.30.86:8000/api/super_table?job=Extractor&lt=${tableData.lessThanDate}&gt=${tableData.greaterThanDate}&page=${tableData.currentPage}`
        fetch(apiURL).then(res => res.json()).then((result) => {
            setTableData(pre => ({
                ...pre,
                isLoading: false,
                data: result.data
            }))
        })
    }

    useEffect(() => {

        fetchTableDataStats()
        fetchTableData()
    }, []);

    useEffect(() => {
        fetchTableData()
    }, [tableData.currentPage, tableData.reset])

    useEffect(() => {
        fetchTableDataStats()
    }, [tableDataStats.reset])

    // const [tableDataStats, setTableDataStats] = useState({
    //     isLoading: true,
    //     data: []
    // })

    // const apiExample = 'http://139.144.30.86:8000/api/stats?job=Extractor&uid=uiEZHND3DxfKMndj6iI2YSYiKZQ2'

    // const [tableData, setTableData] = useState({
    //     isLoading: true,
    //     data: []
    // })

    // const [searchByID, setSearchByID] = useState("");
    // const [filterByQAStatus, setFilterByQAStatus] = useState("qa-status");

    // useEffect(() => {

    //     const lt = (new Date().getTime() / 1000).toFixed(0)
    //     const apiURL = `http://139.144.30.86:8000/api/super_table?job=Extractor&lt=${lt}&gt=0&page=0`
    //     fetch(apiURL).then(res => res.json()).then((result) => {
    //         console.log(result);
    //         setTableData(pre => ({
    //             ...pre,
    //             data: result.data
    //         }))

    //         setTableDataStats(pre => ({
    //             ...pre,
    //             data: result.data
    //         }))
    //     })

    // }, []);

    const getStats = () => {

        const teamStats = [];

        const team = []

        tableDataStats.data.map((_item) => {
            if (!team.includes(_item.Worker)) {
                team.push(_item.Worker)

                const memberProducts = tableDataStats.data.filter((product) => product.Worker === _item.Worker);

                const attempted = memberProducts.length;
                var rejected_nad = 0;
                var under_qa = 0;
                var minor = 0;
                var major = 0;
                var passed = 0;
                var earnings = 0;

                memberProducts.map((product) => {

                    if (!product.status || product.status === "under_qa") {
                        under_qa++;
                    } else if (product.status === "passed") {
                        passed++;
                    } else if (product.status === "minor") {
                        minor++;
                    } else if (product.status === "major") {
                        major++;
                    } else if (product.status === 'rejected_nad') {
                        rejected_nad++;
                    }

                    if (product.earning && product.earning !== 'N/A') {
                        earnings = earnings + parseInt(product.earning)
                    }
                })

                teamStats.push(
                    [
                        _item.Worker,
                        attempted,
                        rejected_nad,
                        under_qa,
                        minor,
                        major,
                        passed,
                        earnings
                    ]
                )
            }
        })
        console.log(teamStats);
        return teamStats
    }

    const getAllProductsByFilter = () => {

        var products = tableData.data;

        if (searchByID !== '') {
            products = products.filter((item) => item.productID.toString().includes(searchByID))
        }

        if (filterByQAStatus !== 'qa-status') {
            products = products.filter((item) => item.status === filterByQAStatus)
        }

        return products
    }

    return (
        <>
            <div>
                <h2>Team Overview</h2>
                <div className="d-flex flex-row justify-content-end gap-2">
                    <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                        <h5 className="m-0 py-1">Starting Date</h5>
                        <input className="px-3" type="date" id="myDate1"
                            onChange={(e) => {
                                setTableDataStats(pre => ({
                                    ...pre,
                                    greaterThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0),
                                }))
                            }}
                            style={{ backgroundColor: "#e8e8e8" }} />
                    </div>
                    <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                        <h5 className="m-0 py-1">Ending Date</h5>
                        <input className="px-3" type="date" id="myDate2"
                            onChange={(e) => {
                                setTableDataStats(pre => ({
                                    ...pre,
                                    lessThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0)
                                }))
                            }}
                            style={{ backgroundColor: "#e8e8e8" }} />
                    </div>
                    <div className="d-flex flex-column gap-1">
                        <button className="btn btn-fetch" onClick={fetchTableDataStats}>Submit</button>
                        <button className="btn btn-fetch bg-danger text-white" onClick={(e) => {
                            e.preventDefault()
                            document.getElementById("myDate1").value = "";
                            document.getElementById("myDate2").value = "";
                            setTableDataStats(pre => ({
                                ...pre,
                                greaterThanDate: 0,
                                lessThanDate: lt,
                                reset: pre.reset + 1
                            }))
                        }}>Clear</button>
                    </div>
                </div>
                {tableDataStats.isLoading ? <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div></div> : <table className="table mt-4 table-bordered">
                    <thead className="table-info">
                        <tr>
                            <th>Person</th>
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
                        {
                            getStats().map((_item, _index) => {
                                return <tr tr key={_index}>
                                    {_item.map((item, index) => {
                                        return <td key={_index + index}>{item}</td>
                                    })}
                                </tr>
                            })

                        }
                    </tbody>
                </table>}
            </div >
            <div className="mt-5">
                <h2>All Products Overview</h2>
                <div className="d-flex flex-row justify-content-end gap-2">
                    <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                        <h5 className="m-0 py-1">Starting Date</h5>
                        <input className="px-3" type="date" id="myDate3"
                            onChange={(e) => {
                                setTableData(pre => ({
                                    ...pre,
                                    greaterThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0)
                                }))
                            }}
                            style={{ backgroundColor: "#e8e8e8" }} />
                    </div>
                    <div className="d-flex flex-column justify-content-end align-items-center" style={{ border: "2px solid #e8e8e8" }}>
                        <h5 className="m-0 py-1">Ending Date</h5>
                        <input className="px-3" type="date" id="myDate4"
                            onChange={(e) => {
                                setTableData(pre => ({
                                    ...pre,
                                    lessThanDate: (new Date(e.target.value).getTime() / 1000).toFixed(0)
                                }))
                            }}
                            style={{ backgroundColor: "#e8e8e8" }} />
                    </div>
                    <div className="d-flex flex-column gap-1">
                        <button className="btn btn-fetch" onClick={fetchTableData}>Submit</button>
                        <button className="btn btn-fetch bg-danger text-white" onClick={(e) => {
                            e.preventDefault()
                            document.getElementById("myDate3").value = "";
                            document.getElementById("myDate4").value = "";
                            setTableData(pre => ({
                                ...pre,
                                greaterThanDate: 0,
                                lessThanDate: lt,
                                reset: pre.reset + 1
                            }))
                        }}>Clear</button>
                    </div>
                </div>
                {tableData.isLoading ? <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div></div> : <table className="table mt-4 table-striped table-bordered align-middle text-center">
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
                                    <option value="minor">MINOR [QA Passed]</option>
                                    <option value="major">MAJOR [QA Passed]</option>
                                    <option value="rejected_nad">Rejected NAD</option>
                                </select>

                            </th>
                        </tr>
                        <tr>
                            <th># SR</th>
                            <th>Thumbnail</th>
                            <th>Product ID</th>
                            <th>Varient ID</th>
                            <th>Extractor Name</th>
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
                                    <img src={item.thumbnail || 'https://img.icons8.com/?size=256&id=j1UxMbqzPi7n&format=png'} alt="" height="52px" />
                                </td>
                                <td>{item.productID}</td>
                                <td>{item.variantID}</td>
                                <td>{item.Worker}</td>
                                <td>{formatDate(item.lastModified)}</td>
                                <td>{item.status === 'under_qa' || !item.status ? 'Under QA' : item.status === 'not_understandable' ? 'Not Understandable' : item.status === 'minor' ? 'MINOR [QA Passed]' : item.status === 'major' ? 'MAJOR [QA Passed]' : item.status === 'passed' ? '100% [QA Passed]' : item.status === 'rejected_nad' ? 'Not a Doable' : 'N/A'}</td>
                                <td>{item.earning || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </div >

            <nav>
                <ul class="pagination">
                    <li class={`page-item ${tableData.currentPage === 0 && "disabled"}`}>
                        <a class="page-link" href="#" tabindex="-1" onClick={() => {
                            setTableData(pre => ({
                                ...pre,
                                currentPage: pre.currentPage - 1
                            }))
                        }}>Previous</a>
                    </li>
                    {Array(...Array(tableData.totalPages + 3)).map((_, index) => {
                        return <li key={index} class={`page-item ${tableData.currentPage === index && 'active'}`}>
                            <a class="page-link" href="#" onClick={() => {
                                setTableData(pre => ({
                                    ...pre,
                                    currentPage: index
                                }))
                            }}>{index + 1}</a>
                        </li>
                    })}

                    <li class={`page-item ${tableData.currentPage === tableData.totalPages - 1 && "disabled"}`}>
                        <a class="page-link" href="#" onClick={() => {
                            setTableData(pre => ({
                                ...pre,
                                currentPage: pre.currentPage + 1
                            }))
                        }}>Next</a>
                    </li>
                </ul>
            </nav>

        </>
    );
};

export default ManagerExtractorTable;
