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
    MenuItem,
    Select,
    Stack,
    TableFooter,
    TextField,
    Typography,
    colors,
} from "@mui/material";


import AddCircleIcon from "@mui/icons-material/AddCircle";
import PropsModel from "../res/PropsModel";
import WoodenSheetTableRow from "../components/dimensionsAnalyst/WoodenSheetTableRow";
import WoodTapeTableRow from "../components/dimensionsAnalyst/WoodTapeTableRow";
import MiscTableRow from "../components/dimensionsAnalyst/MiscTableRow";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function ProductVendorInformation(props) {

    const productCosts = {
        "Estimated Labor Cost": 2000,
        "Estimated Delievery Cost": 4000,
        "Weight Cost": 6000
    }

    const ingredients = {
        "Iron Pipe": {
            "Square  01'' x 01''": {
                price: 2000,
                volume: "",
                weight: "1 kg",
                unit: "ft",
                unitQuantity: 20
            },
            "Square  0.5'' x 0.5''": {
                price: 5000,
                volume: "",
                weight: "1 kg",
                unit: "ft",
                unitQuantity: 10
            },
            "Solid Wood  1.5'' x 1.5''": {
                price: 7000,
                volume: "",
                weight: "1 kg",
                unit: "ft",
                unitQuantity: 30
            }
        },
        "Wooden Sheet": {
            price: 5000,
            unit: 'sq.ft',
            unitQuantity: 32
        },
        "Wood Tape": {
            price: 2000,
            unit: 'ft',
            unitQuantity: 10
        }
    }

    const productDetails = {
        title: 'Laptop/Computer Cart Or Stand with Wheels',
        images: [
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
            'https://oaklyn-furniture.myshopify.com/cdn/shop/files/Laptop_Computer_Cart_Or_Stand_with_Wheels_1.jpg',
        ],
        "weight and dimensions": {
            "Other Dimensions": {
                "Knee Space": "29'' H",
                "Overall": "29.1'' H X 95.2'' W X 59.4'' D",
                "Desktop": "29.1'' H X 35.8'' W X 23.6'' D",
                "Shelf": "22.8'' W X 11.8'' D",
                "Overall Product Weight": "68.34 lb.",
                "Desktop Plus Metal Frame Thickness": "1.57\".",
                "Top thickness": "0.6 inches."
            }
        },
        buildMaterial: "IRON PIPE / MDF",
        productProperties: {
            ironPipeRows: [
                {
                    "pipeTypeNSize": "Square  01'' x 01''",
                    "length": "12",
                    "qty": "42"
                },
                {
                    "pipeTypeNSize": "Square  0.5'' x 0.5''",
                    "length": "4",
                    "qty": "32"
                },
                {
                    "pipeTypeNSize": "Solid Wood  1.5'' x 1.5''",
                    "length": "11",
                    "qty": "13"
                }
            ],
            woodenSheetRows: [
                {
                    "type": "Horizontal",
                    "length": "13",
                    "width": "23",
                    "qty": "2"
                },
                {
                    "type": "Vertical",
                    "length": "34",
                    "width": "12",
                    "qty": "4"
                }
            ],
            woodTapeRows: [
                {
                    "size": "Small",
                    "length": "13",
                    "qty": "1"
                },
                {
                    "size": "Small",
                    "length": "41",
                    "qty": "41"
                },
                {
                    "size": "Big",
                    "length": "41",
                    "qty": "4"
                }
            ],
            miscTableRows: [
                {
                    "item": "Wheels",
                    "size": "Small",
                    "qty": "3"
                },
                {
                    "item": "Cross Rods",
                    "size": "Small",
                    "qty": "1"
                },
                {
                    "item": "Realing",
                    "size": "Small",
                    "qty": "3"
                }
            ]
        }
    }

    var settings = {
        // dots: true,
        // arrows: false,
        // infinite: false,
        // speed: 500,
        // slidesToShow: 8,
        // slidesToScroll: 8,
        // initialSlide: 0,
        // responsive: [
        //     {
        //         breakpoint: 1024,
        //         settings: {
        //             slidesToShow: 5,
        //             slidesToScroll: 5,
        //             infinite: true,
        //             dots: true
        //         }
        //     },
        //     {
        //         breakpoint: 600,
        //         settings: {
        //             slidesToShow: 2,
        //             slidesToScroll: 2,
        //             initialSlide: 2
        //         }
        //     },
        //     {
        //         breakpoint: 480,
        //         settings: {
        //             slidesToShow: 1,
        //             slidesToScroll: 1
        //         }
        //     }
        // ]
        className: "slider variable-width",
        // dots: true,
        infinite: true,
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        swipeToSlide: true,
    };

    const [productPropertiesOld, setProductPropertiesOld] = useState({
        ironPipeRows: [],
        woodenSheetRows: [],
        woodTapeRows: [],
        miscTableRows: [],
    });


    const [filters, setFilters] = useState({
        unitSelector: "Inch",
        buildMaterial: "",
        qaScorecard: "QA Scorecard",
    });

    const getFilledRows = (propType) => {
        const filledData = Array.from(productPropertiesOld[propType]);
        for (var i = filledData.length; i < 9; i++) {
            filledData.push(PropsModel[propType]);
        }
        return filledData;
    };

    const getMiscTableRows = () => {
        const rows = PropsModel["miscTableRows"];
        rows.map((row) => {
            productPropertiesOld.miscTableRows.map((misc) => {
                if (misc.item === row.item) {
                    row.qty = misc.qty;
                    row.size = misc.size;
                }
            });
        });
        return rows;
    };

    const [productProperties, setProductProperties] = useState({
        ironPipeRows: getFilledRows("ironPipeRows"),
        woodenSheetRows: getFilledRows("woodenSheetRows"),
        woodTapeRows: getFilledRows("woodTapeRows"),
        miscTableRows: getMiscTableRows(),
    });

    const addNewRow = (propType) => {
        setProductProperties((pre) => ({
            ...pre,
            [propType]: [...pre[propType], PropsModel[propType]],
        }));
    };


    const getProductProperties = () => {

        // get max on of rows
        const rows = Math.max(productDetails.productProperties.ironPipeRows.length, productDetails.productProperties.woodenSheetRows.length, productDetails.productProperties.woodTapeRows.length, productDetails.productProperties.miscTableRows.length)

        const properties = {
            ironPipeRows: [...productDetails.productProperties.ironPipeRows],
            woodenSheetRows: [...productDetails.productProperties.woodenSheetRows],
            woodTapeRows: [...productDetails.productProperties.woodTapeRows],
            miscTableRows: [...productDetails.productProperties.miscTableRows],
        }

        if (productDetails.productProperties.ironPipeRows.length < rows) {

            const count = rows - productDetails.productProperties.ironPipeRows.length;

            for (var i = 0; i < count; i++) {
                properties['ironPipeRows'].push(PropsModel['ironPipeRows'])
            }
        }

        if (productDetails.productProperties.woodenSheetRows.length < rows) {

            const count = rows - productDetails.productProperties.woodenSheetRows.length;

            for (var i = 0; i < count; i++) {
                properties['woodenSheetRows'].push(PropsModel['woodenSheetRows'])
            }
        }

        if (productDetails.productProperties.woodTapeRows.length < rows) {

            const count = rows - productDetails.productProperties.woodTapeRows.length;

            for (var i = 0; i < count; i++) {
                properties['woodTapeRows'].push(PropsModel['woodTapeRows'])
            }
        }

        if (productDetails.productProperties.miscTableRows.length < rows) {

            const count = rows - productDetails.productProperties.miscTableRows.length;

            for (var i = 0; i < count; i++) {
                properties['miscTableRows'].push(PropsModel['miscTableRows'])
            }
        }

        console.log('properties', properties);

        return properties

    }


    const handleEdit = () => {

    }

    const calculateCost = () => {

        const pipes = []

        productDetails.productProperties.ironPipeRows.map((pipe, index) => {
            const ingredient = (ingredients['Iron Pipe'])[pipe.pipeTypeNSize]
            console.log('ingredient', ingredient);
            const unitCost = ingredient.price / ingredient.unitQuantity

            pipes.push({
                title: pipe.pipeTypeNSize,
                unitCost: unitCost.toFixed(2),
                unitQuantity: `${ingredient.unitQuantity.toFixed(2)} ${ingredient.unit}`,
                quantity: pipe.qty,
                cost: (((pipe.length / 12) * pipe.qty) * unitCost).toFixed(0),
                bom: `${((pipe.length / 12) * pipe.qty).toFixed(1)} ft`
            })
        })

        // const woodenSheets = []
        productDetails.productProperties.woodenSheetRows.map((woodenSheet, index) => {
            const ingredient = ingredients['Wooden Sheet']
            const unitCost = ingredient.price / ingredient.unitQuantity

            pipes.push({
                title: `Wooden Sheet ${woodenSheet.type}`,
                unitCost: unitCost.toFixed(2),
                unitQuantity: `${ingredient.unitQuantity.toFixed(2)} ${ingredient.unit}`,
                quantity: woodenSheet.qty,
                cost: (((woodenSheet.length / 12) * (woodenSheet.width / 12) * woodenSheet.qty) * unitCost).toFixed(),
                bom: `${((woodenSheet.length / 12) * (woodenSheet.width / 12) * woodenSheet.qty).toFixed(1)} sq.ft`
            })
        })

        productDetails.productProperties.woodTapeRows.map((woodTape, index) => {
            const ingredient = ingredients['Wood Tape']
            const unitCost = ingredient.price / ingredient.unitQuantity

            pipes.push({
                title: `Wood Tape ${woodTape.size}`,
                unitCost: unitCost.toFixed(2),
                unitQuantity: `${ingredient.unitQuantity.toFixed(2)} ${ingredient.unit}`,
                quantity: woodTape.qty,
                cost: (((woodTape.length / 12) * woodTape.qty) * unitCost).toFixed(),
                bom: `${((woodTape.length / 12) * woodTape.qty).toFixed(1)} ft`
            })
        })

        return pipes
    }

    const getTotalCost = () => {
        var total = 0
        const data = calculateCost();
        data.map((item) => {
            total += parseInt(item.cost)
        })

        total += parseInt(productCosts["Estimated Delievery Cost"]) + parseInt(productCosts["Estimated Labor Cost"]) + parseInt(productCosts["Weight Cost"]);

        return total
    }

    return (
        <>
            <HeaderSignOut
                userEmail={props.userEmail}
                userRole={props.userRole}
                userJdesc={props.userJdesc}
            />

            <Wrapper>
                <Stack>

                    <Stack>
                        <Typography>{productDetails.title}</Typography>
                        <Stack width='98%'>
                            <Slider {...settings}>
                                {productDetails && productDetails.images.map((source, index) => {
                                    return <div key={index}>
                                        <img src={source} height={'150px'} style={{ padding: '5px' }} />
                                    </div>
                                })}
                            </Slider>
                        </Stack>


                        <Grid container spacing={1} direction="row">

                            <Grid item xs={12} md={3.5}>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="table-head" colSpan={6}>
                                                    Iron Pipe
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="cell-head">
                                                <TableCell>Pipe Type & Size</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Size</TableCell>
                                                <TableCell>L&nbsp;&nbsp;</TableCell>
                                                <TableCell>Qty</TableCell>
                                                <TableCell>Total (ft)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {getProductProperties().ironPipeRows.map((row, index) => {
                                                return (
                                                    <IronPipeTableRow
                                                        key={index}
                                                        _key={index}
                                                        data={row}
                                                        handleEdit={handleEdit}
                                                        unitSelector={filters.unitSelector}
                                                        editable={false}
                                                    />
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            <Grid item xs={12} md={4.5}>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="table-head" colSpan={8}>
                                                    Wooden Sheet
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="cell-head">
                                                <TableCell>Type</TableCell>
                                                <TableCell>L&nbsp;&nbsp;</TableCell>
                                                <TableCell>W&nbsp;&nbsp;</TableCell>
                                                <TableCell>Qty</TableCell>
                                                <TableCell>L (ft.)</TableCell>
                                                <TableCell>W (ft.)</TableCell>
                                                <TableCell>L*W (Sq ft.)</TableCell>
                                                <TableCell>Total S.ft</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {getProductProperties().woodenSheetRows.map((row, index) => {
                                                return (
                                                    <WoodenSheetTableRow
                                                        key={index}
                                                        _key={index}
                                                        data={row}
                                                        handleEdit={handleEdit}
                                                        unitSelector={filters.unitSelector}
                                                        editable={false}
                                                    />
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            {filters.buildMaterial !== "SOLID WOOD" && (
                                <Grid item xs={12} md={2}>
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table padding={0}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="table-head" colSpan={8}>
                                                        Wood Tape
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow className="cell-head">
                                                    <TableCell>Size</TableCell>
                                                    <TableCell>L&nbsp;&nbsp;</TableCell>
                                                    <TableCell>Qty</TableCell>
                                                    <TableCell>Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {getProductProperties().woodTapeRows.map((row, index) => {
                                                    return (
                                                        <WoodTapeTableRow
                                                            key={index}
                                                            _key={index}
                                                            data={row}
                                                            handleEdit={handleEdit}
                                                            unitSelector={filters.unitSelector}
                                                            editable={false}
                                                        />
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            )}

                            <Grid item xs={12} md={2}>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table padding={0}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="table-head" colSpan={8}>
                                                    Misc
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="cell-head">
                                                <TableCell>Item</TableCell>
                                                <TableCell>Size</TableCell>
                                                <TableCell>Qty</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {getProductProperties().miscTableRows.map((row, index) => {
                                                return (
                                                    <MiscTableRow
                                                        key={index}
                                                        _key={index}
                                                        data={row}
                                                        handleEdit={handleEdit}
                                                        editable={false}
                                                    />
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>


                        <Stack padding={2} gap={1}>
                            <Typography fontSize={24}>Product Cost</Typography>
                            <Stack direction='row' justifyContent='space-between' flexWrap='wrap'>

                                <TableContainer className="cost-table" component={Paper} variant="outlined" style={{ width: '50%' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow className="cell-head">
                                                <TableCell>Raw Material</TableCell>
                                                <TableCell>Unit Quantity</TableCell>
                                                <TableCell>Unit Cost</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>BOM</TableCell>
                                                <TableCell>Cost</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {calculateCost().map((data, index) => {
                                                return (
                                                    <TableRow>
                                                        <TableCell width='30%'>
                                                            <TextField
                                                                size="small"
                                                                variant="outlined"
                                                                value={data.title}
                                                                className="cell-disabled"
                                                                disabled
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell width='14%'>
                                                            <TextField
                                                                size="small"
                                                                variant="outlined"
                                                                value={data.unitQuantity}
                                                                className="cell-disabled"
                                                                disabled
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell width='14%'>
                                                            <TextField
                                                                size="small"
                                                                variant="outlined"
                                                                value={data.unitCost}
                                                                className="cell-disabled"
                                                                disabled
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell width='14%'>
                                                            <TextField
                                                                size="small"
                                                                variant="outlined"
                                                                value={data.quantity}
                                                                className="cell-disabled"
                                                                disabled
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell width='14%'>
                                                            <TextField
                                                                size="small"
                                                                variant="outlined"
                                                                value={data.bom}
                                                                className="cell-disabled"
                                                                disabled
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell width='14%'>
                                                            <TextField
                                                                size="small"
                                                                variant="outlined"
                                                                value={data.cost}
                                                                className="cell-disabled"
                                                                disabled
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <TableContainer className="cost-table" component={Paper} variant="outlined" style={{ width: '30%' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow className="cell-head">
                                                <TableCell>Cost Type</TableCell>
                                                <TableCell>Cost (Rs.)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.keys(productCosts).map((cost) => {
                                                return <TableRow>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            value={cost}
                                                            className="productCost-cell-disabled"
                                                            disabled
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            value={productCosts[cost]}
                                                            className="productCost-cell-disabled"
                                                            disabled
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            })}
                                        </TableBody>
                                        <TableHead>
                                            <TableRow className="costProduct-cell-head">
                                                <TableCell>Total Cost</TableCell>
                                                <TableCell>{getTotalCost()}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                    </Table>
                                </TableContainer>



                            </Stack>

                        </Stack>

                    </Stack>

                </Stack>
            </Wrapper>

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
    color: red;
}

.costProduct-cell-head > th {
    border: 1px solid white;
    color: white;
    font-weight: bold;
    font-size: medium;
    text-align: center;
  }

  .productCost-cell-disabled {
    background-color: #e4c1f9;
  }

  .productCost-cell-disabled > div {
    font-weight: bold;
  }

  .cell-disabled {
    background-color: #c6efce;
  }

  .cell-disabled > div {
    font-weight: bold;
  }

  .cost-table td div {
    font-size: medium;
  }

  .costProduct-cell-head .cell-disabled {
    background-color: black;
  }
`;

export default ProductVendorInformation