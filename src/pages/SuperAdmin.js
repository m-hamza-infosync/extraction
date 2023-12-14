import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IronPipeTableRow from "../components/dimensionsAnalyst/IronPipeTableRow";
import HeaderSignOut from "../components/header/HeaderSignOut";
import {
    Button,
    ButtonGroup,
    Card,
    CircularProgress,
    Grid,
    Link,
    MenuItem,
    Pagination,
    Select,
    Stack,
    TableFooter,
    TextField,
    Typography,
    colors,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import SuperAdminSidebar from "../components/sidebar/SuperAdminSidebar";
import { formatDate } from "../utils/formatDate";
import { sumArrays } from "../utils/sumArrays";

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { firestore } from "../firebase";

function SuperAdmin(props) {

    const sortOrder = ["Extractor", "QA-Extractor", "DimAna", "QA-DimAna"];

    const [tableFilter, setTableFilter] = useState('Extractor')
    const [hideManagersAndUsersOverview, setHideManagersAndUsersOverview] = useState(false)

    const lt = (new Date().getTime() / 1000).toFixed(0)

    const [tableData, setTableData] = useState({
        isLoading: true,
        lessThanDate: lt,
        greaterThanDate: 0,
        currentPage: 0,
        totalPages: 1,
        reset: 0,
        data: []
    })

    const [managersTableData, setManagersTableData] = useState({
        isLoading: true,
        lessThanDate: lt,
        greaterThanDate: 0,
        currentPage: 0,
        totalPages: 1,
        reset: 0,
        data: [],
        managers: {}
    })

    const [usersTableData, setUsersTableData] = useState({
        isLoading: true,
        lessThanDate: lt,
        greaterThanDate: 0,
        currentPage: 0,
        totalPages: 1,
        reset: 0,
        data: []
    })

    const fetchManagersTableData = async () => {

        setManagersTableData((pre) => ({
            ...pre,
            isLoading: true
        }))

        const usersCollectionRef = collection(firestore, "users");

        // Use a query to filter users with role=manager
        const q = query(usersCollectionRef, where("role", "==", "manager"));

        // Fetch data based on the query
        const snapshot = await getDocs(q);

        let managers = [];
        snapshot.forEach((doc) => {
            managers.push({ ...doc.data(), id: doc.id });
        });

        const managers_stats = await Promise.all(
            managers.sort((a, b) => {
                const indexA = sortOrder.indexOf(a.jdesc);
                const indexB = sortOrder.indexOf(b.jdesc);
                return indexA - indexB;
            }).map(async (manager) => {
                const result = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/stats?job=${manager.jdesc}&lt=${lt}&gt=0`).then((res) => res.json()).catch((e) => console.log('error occured', e))

                const attempted = result.attempts;
                var rejected_nad = result.attempts - result.not_validated - result.minor_changes - result.major_changes - result.qa_passed;
                var not_understandable = manager.jdesc.includes('Extractor') ? result.rejects : 0
                var under_qa = result.not_validated;
                var minor = result.minor_changes;
                var major = result.major_changes;
                var passed = result.qa_passed
                var earnings = result.earning;
                return [manager.name, manager.jdesc, attempted, rejected_nad, not_understandable, under_qa, minor, major, passed]
            })
        )

        setManagersTableData((pre) => ({
            ...pre,
            isLoading: false,
            data: managers_stats
        }))

    }

    const fetchUsersTableData = async () => {
        setUsersTableData((pre) => ({
            ...pre,
            isLoading: true
        }))

        const usersCollectionRef = collection(firestore, "users");

        // Use a query to filter users with role=manager
        const q = query(usersCollectionRef, where("role", "==", "worker"));

        // Fetch data based on the query
        const snapshot = await getDocs(q);

        let workers = [];
        snapshot.forEach((doc) => {
            workers.push({ ...doc.data(), id: doc.id });
        });

        console.log('workers', workers);

        const workers_stats = await Promise.all(
            workers.sort((a, b) => {
                const indexA = sortOrder.indexOf(a.jdesc);
                const indexB = sortOrder.indexOf(b.jdesc);
                return indexA - indexB;
            }).map(async (worker) => {
                const result = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/stats?job=${worker.jdesc}&uid=${worker.id}&lt=${lt}`).then((res) => res.json()).catch((e) => console.log('error occured', e))

                const attempted = result.attempts;
                var rejected_nad = result.attempts - result.not_validated - result.minor_changes - result.major_changes - result.qa_passed;
                var not_understandable = worker.jdesc.includes('Extractor') ? result.rejects : 0
                var under_qa = result.not_validated;
                var minor = result.minor_changes;
                var major = result.major_changes;
                var passed = result.qa_passed
                var earnings = result.earning.toFixed(0);
                return [worker.name, worker.jdesc, attempted, rejected_nad, not_understandable, under_qa, minor, major, passed, earnings]
            })
        )

        setUsersTableData((pre) => ({
            ...pre,
            isLoading: false,
            data: workers_stats
        }))
    }

    const fetchSuperAdminData = async (currentPage = tableData.currentPage) => {
        //http://139.144.30.86:8000/api/super_table?job=Extractor

        setTableData((pre) => ({
            ...pre,
            isLoading: true
        }))

        const lt = (new Date().getTime() / 1000).toFixed(0)
        const apiURL = `${process.env.REACT_APP_SERVER_ADDRESS}/api/super_table?job=${tableFilter}&lt=${lt}&gt=0&page=${currentPage}`

        fetch(apiURL).then((res) => res.json()).then((result) => {

            console.log('result', result);

            setTableData((pre) => ({
                ...pre,
                isLoading: false,
                data: result.data,
                currentPage: result.curr_page,
                totalPages: result.total_pages
            }))

        }).catch((e) => console.log('error occured', e))
    }

    useEffect(() => {
        fetchManagersTableData()
        fetchUsersTableData()
    }, [])

    useEffect(() => {
        fetchSuperAdminData(0)
    }, [tableFilter])

    useEffect(() => {
        fetchSuperAdminData()
    }, [tableData.currentPage])

    const [searchByID, setSearchByID] = useState("");
    const [filterByQAStatus, setFilterByQAStatus] = useState("qa-status");

    const getAllProductsByFilter = () => {

        var products = tableData.data;
        // console.log('pro', products);

        if (searchByID !== '') {
            products = products.filter((item) => item.productID.toString().includes(searchByID))
        }

        // if (filterByQAStatus !== 'qa-status') {
        //     products = products.filter((item) => item.status === filterByQAStatus)
        // }

        if (filterByQAStatus !== 'qa-status') {
            products = products.filter((item) => filterByQAStatus === 'under_qa' ? item.status === null : item.status === filterByQAStatus)
        }

        return products
    }

    const navigateToItem = (productID) => {
        if (tableFilter.includes('Extractor')) return
        // window.location.href = `/product-detail-info?job=${tableFilter}&pid=${productID}`
        window.open(`/product-detail-info?job=${tableFilter}&pid=${productID}`, "_blank", "noreferrer");
    }

    return (
        <>
            {/* <Header
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />
            <SuperAdminSidebar /> */}

            <Wrapper>
                <div style={{ height: 'calc(100vh - 135px)', overflow: 'auto' }}>

                    <Stack direction='row' justifyContent='center'>
                        <Button variant='outlined' color="error" onClick={() => {
                            setHideManagersAndUsersOverview(pre => !pre)
                        }}>
                            {hideManagersAndUsersOverview ? 'Show Managers and Users Overview' : 'Hide Managers and Users Overview'}
                        </Button>
                    </Stack>

                    <div style={{ display: hideManagersAndUsersOverview ? 'none' : 'block' }}>
                        <h2>Managers Overview</h2>
                        {managersTableData.isLoading ? <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div></div> : <table className="table mt-4 table-bordered table-striped align-middle text-center">
                            <thead className="table-info">
                                <tr>
                                    <th>Manager</th>
                                    <th>Role</th>
                                    <th>Attempted</th>
                                    <th>Rejected NAD</th>
                                    <th>Not Understandable</th>
                                    <th>Under QA</th>
                                    <th>MINOR [QA Passed]</th>
                                    <th>MAJOR [QA Passed]</th>
                                    <th>[100%] QA Passed</th>
                                    {/* <th>Earnings</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    managersTableData.data.map((_item, _index) => {
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

                    <div style={{ display: hideManagersAndUsersOverview ? 'none' : 'block' }}>
                        <h2>Users Overview</h2>
                        {usersTableData.isLoading ? <div className=" d-flex flex-row justify-content-center"> <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div></div> : <table className="table mt-4 table-bordered table-striped align-middle text-center">
                            <thead className="table-info">
                                <tr>
                                    <th>Person</th>
                                    <th>Role</th>
                                    <th>Attempted</th>
                                    <th>Rejected NAD</th>
                                    <th>Not Understandable</th>
                                    <th>Under QA</th>
                                    <th>MINOR [QA Passed]</th>
                                    <th>MAJOR [QA Passed]</th>
                                    <th>[100%] QA Passed</th>
                                    <th>Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    usersTableData.data.map((_item, _index) => {
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

                    {tableData.isLoading ? <Stack marginTop={'4px'} marginBottom={'4px'} direction='row' justifyContent='center' alignItems='center' height='calc(100vh - 8px)'>
                        <CircularProgress size={56} color="info" />
                    </Stack> :
                        <Stack>
                            <Stack direction='row' justifyContent='end' alignItems='center' m={2}>
                                <Stack direction="column">
                                    <Typography>Filter By Job</Typography>
                                    <Select
                                        size="medium"
                                        value={tableFilter}
                                        onChange={(e) => {
                                            setTableFilter(e.target.value);
                                        }}
                                        name="tableFilterList"
                                    >
                                        <MenuItem value="Extractor">Extractor</MenuItem>
                                        <MenuItem value="QA-Extractor">QA-Extractor</MenuItem>
                                        <MenuItem value="DimAna">DimAna</MenuItem>
                                        <MenuItem value="QA-DimAna">QA-DimAna</MenuItem>
                                    </Select>
                                </Stack>
                            </Stack>

                            {tableData.isLoading ? <Stack direction='row' justifyContent='center'>
                                <CircularProgress />
                            </Stack> :

                                <table className="table mt-4 table-bordered table-striped align-middle text-center">
                                    <thead className="table-dark">
                                        <tr className="border-0 bg-white">
                                            <th colSpan={2} className="bg-white text-dark border-0">
                                                {getAllProductsByFilter().length} Results Found
                                            </th>
                                            <th className="bg-white" style={{ maxWidth: 200 }}>
                                                <div className="d-flex flex-row">
                                                    <input
                                                        className="p-2 w-100"
                                                        type="text"
                                                        placeholder="Search by P.ID"
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
                                            <th className="bg-white" style={{ maxWidth: 200 }}>

                                                <select
                                                    className="p-2 w-100"
                                                    name="qa-status"
                                                    id="qa-status"
                                                    onChange={(e) => setFilterByQAStatus(e.target.value)}
                                                    value={filterByQAStatus}
                                                >
                                                    <option value="qa-status">Filter by Dim.QA Status</option>
                                                    <option value="under_qa">Under QA</option>
                                                    <option value="not_understandable">Not Understandable</option>
                                                    <option value="rejected_nad">Not a Doable</option>
                                                    <option value="passed">100% [QA Passed]</option>
                                                    <option value="minor">MINOR [QA Passed]</option>
                                                    <option value="major">MAJOR [QA Passed]</option>
                                                </select>

                                            </th>
                                        </tr>
                                        <tr>
                                            <th># SR</th>
                                            <th>Thumbnail</th>
                                            <th>Product ID</th>
                                            <th>Variant ID</th>
                                            <th>{tableFilter}</th>
                                            <th>Date</th>
                                            <th>{tableFilter === 'Extractor' || tableFilter === 'QA-Extractor' ? 'Extraction' : 'DimAna'} QA Status</th>
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
                                                <td style={{ paddingTop: 2, paddingBottom: 2 }}>
                                                    <img
                                                        src={item.thumbnail || 'https://img.icons8.com/?size=256&id=j1UxMbqzPi7n&format=png'}
                                                        onClick={() => { navigateToItem(item.productID) }}
                                                        alt=""
                                                        height="52px"
                                                    />
                                                </td>
                                                <td>
                                                    {tableFilter.includes('Extractor') ? item.productID
                                                        : <a className="link-dark" href={`/product-detail-info?job=${tableFilter}&pid=${item.productID}`} underline="hover" target="_blank">
                                                            {item.productID}
                                                        </a>}
                                                </td>

                                                <td>{item.variantID || 'N/A'}</td>
                                                <td>{tableFilter === 'QA-Extractor' || tableFilter === 'QA-DimAna' ? item['QA-Worker'] : item.Worker}</td>
                                                <td>{formatDate(item.lastModified)}</td>

                                                <td>{(item.status === null || item.status === 'under_qa') ? 'Under QA' : item.status === 'not_understandable' ? 'Not Understandable' : item.status === 'rejcted_nad' ? 'Rejected NAD' : item.status === 'minor' ? 'MINOR [QA Passed]' : item.status === 'major' ? 'MAJOR [QA Passed]' : item.status === 'passed' ? '100% [QA Passed]' : item.status === 'rejected_nad' ? 'Not a Doable' : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            }

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
                                    {Array(...Array(tableData.totalPages)).map((_, index) => {
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

                        </Stack>
                    }
                </div>

            </Wrapper >

        </>
    );
}

const Wrapper = styled.main`
  input {
    padding: 8.5px 0px;
    text-align: center;
  }

  td {
    padding: 0;
    border-bottom: none;
  }
  td div {
    border-radius: 0px;
    font-size: small;
  }
  .table-head {
    background-color: black;
    color: white;
    font-weight: bold;
    text-align: center;
  }

  .cell-head {
    background-color: #ffeb9c;
    white-space: nowrap;
    border: 1px solid black;
  }

  .cell-head > th {
    color: #9c6500;
    font-weight: bold;
    border: 1px solid black;
    font-size: medium;
  }

  .costProduct-cell-head {
    background-color: black;
    white-space: nowrap;
    border: 1px solid black;
}

.costProduct-cell-head > th {
    border: 1px solid white;
    color: white;
    font-weight: bold;
    font-size: medium;
  }

  .productCost-cell-disabled {
    background-color: #e4c1f9;
  }

  .productCost-cell-disabled > div {
    font-weight: bold;
  }

  .cell-entry {
    background-color: #c6efce;
    font-size: large;
    text-align: center;
    border: 1px solid black;
    padding: 10px;
}

.cell-entry > div {
    font-weight: bold;
  }

  .cost-table td div {
    font-size: medium;
  }

  .costProduct-cell-head .cell-disabled {
    background-color: black;
  }
`;

export default SuperAdmin




{/* < table className = "table mt-4 table-bordered table-striped align-middle text-center" >
<thead className="table-dark">
    <tr className="border-0 bg-white">
        <th colSpan={2} className="bg-white text-dark border-0">
            {getAllProductsByFilter().length} Results Found
        </th>
        <th className="bg-white" style={{ maxWidth: 200 }}>
            <div className="d-flex flex-row">
                <input
                    className="p-2 w-100"
                    type="text"
                    placeholder="Search by P.ID"
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
        <th className="bg-white"></th>
        <th className="bg-white"></th>
        <th className="bg-white" style={{ maxWidth: 200 }}>

            <select
                className="p-2 w-100"
                name="qa-status"
                id="qa-status"
                onChange={(e) => setFilterByExtQAStatus(e.target.value)}
                value={filterByExtQAStatus}
            >
                <option value="qa-status">Filter by Ext.QA Status</option>
                <option value="rejected_nad">Rejected NAD</option>
                <option value="passed">100% [QA Passed]</option>
                <option value="minor">MINOR [QA Passed]</option>
                <option value="major">MAJOR [QA Passed]</option>
            </select>

        </th>
        <th className="bg-white" style={{ maxWidth: 200 }}>

            <select
                className="p-2 w-100"
                name="qa-status"
                id="qa-status"
                onChange={(e) => setFilterByDimQAStatus(e.target.value)}
                value={filterByDimQAStatus}
            >
                <option value="qa-status">Filter by Dim.QA Status</option>
                <option value="not_understandable">Not Understandable</option>
                <option value="passed">100% [QA Passed]</option>
                <option value="minor">MINOR [QA Passed]</option>
                <option value="major">MAJOR [QA Passed]</option>
            </select>

        </th>
    </tr>
    <tr>
        <th># SR</th>
        <th>Thumbnail</th>
        <th>Product ID</th>
        <th>Varient ID</th>
        <th>Extractor - Date</th>
        <th>QA-Extractor - Date</th>
        <th>DimAna - Date</th>
        <th>QA-DimAna - Date</th>
        <th>Extraction QA Status</th>
        <th>DimAna QA Status</th>
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
            <td>{item.varientID}</td>
            <td>
                <div className="d-flex px-2 justify-content-between" style={{ fontSize: 'medium' }}>
                    <p className="fw-bold">{item.extractor}</p>
                    <p className="text-secondary ">
                        [{formatDate(item.extractionTimeStamp).split('|')[0]}]</p>
                </div>
            </td>
            <td>
                <div className="d-flex px-2 justify-content-between" style={{ fontSize: 'medium' }}>
                    <p className="fw-bold">{item.qaExtractor}</p>
                    <p className="text-secondary ">
                        [{formatDate(item.extractionTimeStamp).split('|')[0]}]</p>
                </div>
            </td>
            <td>
                <div className="d-flex px-2 justify-content-between" style={{ fontSize: 'medium' }}>
                    <p className="fw-bold">{item.dimAna}</p>
                    <p className="text-secondary">
                        [{formatDate(item.extractionTimeStamp).split('|')[0]}]</p>
                </div>
            </td>
            <td>
                <div className="d-flex px-2 justify-content-between" style={{ fontSize: 'medium' }}>
                    <p className="fw-bold">{item.qaDimAna}</p>
                    <p className="text-secondary">
                        [{formatDate(item.extractionTimeStamp).split('|')[0]}]</p>
                </div>
            </td>
            <td>{item.qaExtractionQAStatus === 'under_qa' ? 'Under QA' : item.qaExtractionQAStatus === 'not_understandable' ? 'Not Understandable' : item.qaExtractionQAStatus === 'minor' ? 'MINOR [QA Passed]' : item.qaExtractionQAStatus === 'major' ? 'MAJOR [QA Passed]' : item.qaExtractionQAStatus === 'passed' ? '100% [QA Passed]' : item.qaExtractionQAStatus === 'rejected_nad' ? 'Not a Doable' : 'N/A'}</td>
            <td>{item.qaDimAnaQAStatus === 'under_qa' ? 'Under QA' : item.qaDimAnaQAStatus === 'not_understandable' ? 'Not Understandable' : item.qaDimAnaQAStatus === 'minor' ? 'MINOR [QA Passed]' : item.qaDimAnaQAStatus === 'major' ? 'MAJOR [QA Passed]' : item.qaDimAnaQAStatus === 'passed' ? '100% [QA Passed]' : 'N/A'}</td>
        </tr>
    ))}
</tbody>
</ > */}