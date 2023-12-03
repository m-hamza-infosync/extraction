import React, { useEffect, useState } from "react";
import "./extraction.css";
// import extractImages from "../res/Extraction.json";

import CancelIcon from "@mui/icons-material/Cancel";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import HeaderSignOut from "../components/header/HeaderSignOut";
import { toast, ToastContainer } from "react-toastify";

const Extraction = (props) => {
  const navigate = useNavigate();

  // =========================================================================
  const [searchQuery, setSearchQuery] = useState('')
  // =========================================================================

  const [allImages, setAllImages] = useState([]);
  const [selectedButton, setSelectedButton] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState([]);
  const [selectedDimentional, setSelectedDimentional] = useState([]);
  const [selectedWhiteBg, setSelectedWhiteBg] = useState([]);
  const [selectedOrdinary, setSelectedOrdinary] = useState([]);

  const [selectedDiscard, setSelectedDiscard] = useState([]);
  const [imageSelectedIds, setImageSelectedIds] = useState([]);

  const [defaultThumbnail, setDefaultThumbnail] = useState([]);

  // =========================================================================

  // for default thumbnail state
  const [isDefaultThumbnailEditMode, setIsDefaultThumbnailEditMode] =
    useState(false);

  // =========================================================================

  // for default Dimesniuon  state
  const [defaultDimension, setDefaultDimension] = useState([]);

  const [isDefaultDimensionEditMode, setIsDefaultDimensionEditMode] =
    useState(false);

  // =========================================================================

  const [sku, setSku] = useState({});
  const [videos, setVideos] = useState([]);
  const [token, setToken] = useState("");
  // const [jsonFormData, setJsonFormData] = useState("")
  const [showId, setShowId] = useState("");

  // state for disable button
  const [isThumbnailButtonDisabled, setIsThumbnailButtonDisabled] =
    useState(false);
  const [isDimensionalButtonDisabled, setIsDimensionalButtonDisabled] =
    useState(false);
  const [isWhiteBgButtonDisabled, setIsWhiteBgButtonDisabled] = useState(false);
  const [isOrdinaryButtonDisabled, setIsOrdinaryButtonDisabled] =
    useState(false);
  const [isDiscardButtonDisabled, setIsDiscardButtonDisabled] = useState(false);
  // state for again not selectoed any images once map
  const [hasThumbnailImagesMapped, setHasThumbnailImagesMapped] =
    useState(false);
  const [hasDimensionalImagesMapped, setHasDimensionalImagesMapped] =
    useState(false);
  const [hasWhiteBgImagesMapped, setHasWhiteBgImagesMapped] = useState(false);
  const [hasOrdinaryImagesMapped, setHasOrdinaryImagesMapped] = useState(false);
  const [hasDiscardImagesMapped, setHasDiscardImagesMapped] = useState(false);

  const [isFetchButtonDisabled, setIsFetchButtonDisabled] = useState(false);
  // for show button
  const [selectedImage, setSelectedImage] = useState(null);

  // again edit or save images
  const [isThumbnailEditMode, setIsThumbnailEditMode] = useState(false);
  const [isDimensionalEditMode, setIsDimensionalEditMode] = useState(false);
  const [isWhiteBgEditMode, setIsWhiteBgEditMode] = useState(false);
  const [isOrdinarylEditMode, setIsOrdinarylEditMode] = useState(false);
  const [isDiscardlEditMode, setIsDiscardlEditMode] = useState(false);

  const [visibilityNotDoable, setVisibilityNotDoable] = useState(false);

  const [url, setUrl] = useState("");
  const [jsonResult, setJsonResult] = useState(""); // Initialize as an empty string

  // http://139.144.30.86:3001/api/fetch-data
  // 161.97.167.225/scrape
  // http://161.97.167.225:8000/api/get_job
  //http://139.144.30.86:8000/api/get_job
  const executePythonScript = async (e) => {

    if (props.user) {
      // Get the authentication token
      props.user
        .getIdToken()
        .then((token) => {
          // Define the API endpoint URL
          var apiUrl = `${process.env.REACT_APP_SERVER_ADDRESS}/api/get_job`
          if (e.target.id === 'btn-go' && searchQuery !== '') {
            apiUrl = apiUrl + `?url=${encodeURIComponent(searchQuery)}`
          }
          console.log(token);
          setToken(token);
          // Make an authenticated API request
          fetch(apiUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              // Handle the API response data
              console.log("API Response:", data);
              setIsFetchButtonDisabled(true);
              // Extract the first index image and add it to selectedThumbnail
              // if (data.thumbnails.length > 0) {
              //   setSelectedThumbnail([data.thumbnails[0]]);
              //   data.unsorted = data.unsorted.slice(1); // Remove the first index image
              //   console.log("selected thumbnail", selectedThumbnail);
              // }
              setAllImages(data.unsorted);
              setDefaultThumbnail(data.thumbnails);
              setDefaultDimension(data.dimensional);
              setSku(data.id);
              setVideos(data.videos);
              setShowId(data.sku);
              setVisibilityNotDoable(true);
            })
            .catch((error) => {
              // Handle any errors
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          // Handle any errors while getting the token
          console.error("Token Error:", error);
        });
    }
    // try {
    //   const response = await fetch("http://139.144.30.86:3001/api/fetch-data", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ url }),
    //   });
    //   const data = await response.json();

    //   setAllImages(data.images);

    //   // Update the selectedThumbnail and selectedDimentional states with initial images
    //   if (data.images.length >= 2) {
    //     setSelectedThumbnail([data.images[0]]);
    //     setSelectedDimentional([data.images[1]]);
    //     setSelectedButton("Thumbnail"); // Highlight Thumbnail button by default
    //   }
    //   // Convert the JSON object to a string
    //   const jsonString = JSON.stringify(data, null, 2); // Add formatting (indentation)

    //   setJsonResult(jsonString);
    //   // Set the JSON string in the state
    // } catch (error) {
    //   console.error("Error:", error);

    //   // Handle the error, e.g., by displaying an error message
    //   setJsonResult("An error occurred while fetching data.");
    // }
    // console.log(JSON.stringify({ url }));
  };
  // MERGE SELECTED DIMENSION AND DEFAULT DIMENSION
  const mergeSelectedDefaultDimension = [
    ...selectedDimentional,
    ...defaultDimension,
  ];
  const mergeSelectedDefaultThumbnail = [
    ...selectedThumbnail,
    ...defaultThumbnail,
  ];
  // ! DEFAULT THUMBNAIL IMAGES METHOS START

  const handleDefaultThumbnailEdit = (value) => {
    setIsDefaultThumbnailEditMode(value);
  };

  // DIMSINAL FUNTION
  const handleDefaultDimensionEdit = (editMode) => {
    setIsDefaultDimensionEditMode(editMode);
  };

  const resetDefaultDimension = (item) => {
    // Clone the current defaultDimension state
    const updatedDefaultDimension = [...defaultDimension];

    // Find the index of the item to remove from the defaultDimension array
    const itemIndex = updatedDefaultDimension.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (itemIndex !== -1) {
      // Remove the item from the array
      updatedDefaultDimension.splice(itemIndex, 1);

      // Set the updated state for defaultDimension
      setDefaultDimension(updatedDefaultDimension);

      // Add the removed item back to the allImages array
      setAllImages((prevImages) => [...prevImages, item]);
    }
  };

  // const saveDefaultThumbnail = () => {
  //   // Implement code to save the edited defaultThumbnail images here
  //   setIsDefaultThumbnailEditMode(false);
  // };

  // const cancelDefaultThumbnailEdit = () => {
  //   setIsDefaultThumbnailEditMode(false);
  // };
  // ! DEFAULT THUMBNAIL IMAGES METHOS START

  const editImages = (section) => {
    switch (section) {
      case "Thumbnail":
        setIsThumbnailEditMode(!isThumbnailEditMode);
        break;
      case "Dimensional":
        setIsDimensionalEditMode(!isDimensionalEditMode);
        break;
      case "WhiteBg":
        setIsWhiteBgEditMode(!isWhiteBgEditMode);
        break;
      case "Ordinary":
        setIsOrdinarylEditMode(!isOrdinarylEditMode);
        break;
      case "Discard":
        setIsDiscardlEditMode(!isDiscardlEditMode);
        break;
      default:
        // Handle the default case or any other sections if needed
        break;
    }
  };

  // Enable/disable buttons based on the selected button
  const handleButtonClick = (buttonName) => {

    setSelectedButton(buttonName);

  };

  // reset all state in edit button logic

  const resetThumbnailImage = (item) => {
    // Reset selected thumbnail images
    setSelectedThumbnail([]);
    setAllImages((prevImages) => [...prevImages, item]);
    setIsThumbnailButtonDisabled(hasThumbnailImagesMapped);

    // Disable the edit mode for thumbnail images
    // setIsThumbnailEditMode(false);

    // Clear the selected image IDs
    setImageSelectedIds([]);

    // Reset the flag indicating that thumbnail images have been mapped
    setHasThumbnailImagesMapped(false);
  };

  const resetDefaultThumbnail = (item) => {
    // Find the index of the selected item in the defaultThumbnail array
    const itemIndex = defaultThumbnail.findIndex(
      (image) => image.id === item.id
    );

    if (itemIndex !== -1) {
      // Create a copy of the defaultThumbnail array
      const updatedDefaultThumbnail = [...defaultThumbnail];

      // Remove the selected item from the copy
      updatedDefaultThumbnail.splice(itemIndex, 1);

      // Update the defaultThumbnail state with the updated array
      setDefaultThumbnail(updatedDefaultThumbnail);

      // Optionally, you can add the selected item back to the allImages array
      setAllImages((prevImages) => [...prevImages, item]);
    }
  };

  // reset function for dimensional
  const resetDimensionalImage = (item) => {
    // Reset selected dimensional images
    setSelectedDimentional(
      selectedDimentional.filter((img) => img.id !== item.id)
    );
    setAllImages((prevImages) => [...prevImages, item]);
    // setIsDimensionalEditMode(false);
    setImageSelectedIds([]);
    setHasDimensionalImagesMapped(false);
  };
  // reset function for whiteBg
  const resetWhiteBg = (item) => {
    // Reset selected whiteBg images
    setSelectedWhiteBg(selectedWhiteBg.filter((img) => img.id !== item.id));
    setAllImages((prevImages) => [...prevImages, item]);
    // setIsDimensionalEditMode(false);
    setImageSelectedIds([]);
    setHasWhiteBgImagesMapped(false);
  };
  // reset function of ordinary
  const resetOrdinaryImages = (item) => {
    setSelectedOrdinary(selectedOrdinary.filter((img) => img.id !== item.id));
    setAllImages((prevImages) => [...prevImages, item]);
    // setIsOrdinarylEditMode(false);
    setImageSelectedIds([]);
    setHasOrdinaryImagesMapped(false);
  };

  const resetDiscardImage = (item) => {
    setSelectedDiscard(selectedDiscard.filter((img) => img.id !== item.id));
    setAllImages((prevImages) => [...prevImages, item]);
    // setIsDiscardlEditMode(false);
    setImageSelectedIds([]);
    setHasDiscardImagesMapped(false);
  };

  // Save images fucntion
  const saveImages = () => {
    setIsThumbnailEditMode(false);
    setIsDimensionalEditMode(false);
    setIsWhiteBgEditMode(false);
    setIsOrdinarylEditMode(false);
    setIsDiscardlEditMode(false);
  };
  const selectMyItem = (item) => {
    setSelectedImage(item);

    if (imageSelectedIds.includes(item)) {
      setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    } else {
      // setImageSelectedIds([item]);
      setImageSelectedIds([...imageSelectedIds, item]);
    }

    // if (selectedButton === "Thumbnail") {
    //   if (!hasThumbnailImagesMapped) {
    //     // Allow selection of thumbnail images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       setImageSelectedIds([item]);
    //     }
    //   }
    // } else if (selectedButton === "Dimensional") {
    //   if (!hasDimensionalImagesMapped) {
    //     // Allow selection of dimensional images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       // setImageSelectedIds([item]);
    //       setImageSelectedIds([...imageSelectedIds, item]);
    //     }
    //   }
    // } else if (selectedButton === "WhiteBg") {
    //   if (!hasWhiteBgImagesMapped) {
    //     // Allow selection of dimensional images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       // setImageSelectedIds([item]);
    //       setImageSelectedIds([...imageSelectedIds, item]);
    //     }
    //   }
    // } else if (selectedButton === "Ordinary") {
    //   if (!hasOrdinaryImagesMapped) {
    //     // Allow selection of ordinary images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       // setImageSelectedIds([item]);
    //       setImageSelectedIds([...imageSelectedIds, item]);
    //     }
    //   }
    // } else if (selectedButton === "Discard") {
    //   if (!hasDiscardImagesMapped) {
    //     // Allow selection of discard images only if they haven't been mapped
    //     if (imageSelectedIds.includes(item)) {
    //       setImageSelectedIds(imageSelectedIds.filter((id) => id !== item));
    //     } else {
    //       setImageSelectedIds([...imageSelectedIds, item]);
    //     }
    //   }
    // }
  };

  // logic of submit button for show and delete images

  const submitData = () => {

    // if (selectedButton === "Thumbnail") {
    //   setHasThumbnailImagesMapped(true);
    //   setImageSelectedIds([]);
    // } else if (selectedButton === "Dimensional") {
    //   setHasDimensionalImagesMapped(true);
    //   setImageSelectedIds([]);
    // } else if (selectedButton === "WhiteBg") {
    //   setHasWhiteBgImagesMapped(true);
    //   setImageSelectedIds([]);
    // } else if (selectedButton === "Ordinary") {
    //   setHasOrdinaryImagesMapped(true);
    //   setImageSelectedIds([]);
    // } else if (selectedButton === "Discard") {
    //   setHasDiscardImagesMapped(true);
    //   setImageSelectedIds([]);
    // }

    if (imageSelectedIds.length === 0) {
      return
    }
    setImageSelectedIds([])
    if (selectedButton === "") {
      return;
    }

    if (selectedButton === "Thumbnail") {
      setHasThumbnailImagesMapped(true);
    } else if (selectedButton === "Dimensional") {
      setHasDimensionalImagesMapped(true);
    } else if (selectedButton === "WhiteBg") {
      setHasWhiteBgImagesMapped(true);
    } else if (selectedButton === "Ordinary") {
      setHasOrdinaryImagesMapped(true);
    } else if (selectedButton === "Discard") {
      setHasDiscardImagesMapped(true);
    }

    if (selectedButton === "Thumbnail") {
      // setImageSelectedIds(imageSelectedIds.filter((id) => id == id));
      setSelectedThumbnail([imageSelectedIds[0]]);
      console.log('imageSelectedIds', imageSelectedIds, imageSelectedIds[0]);
    } else if (selectedButton === "Dimensional") {
      setSelectedDimentional([...selectedDimentional, ...imageSelectedIds]);
    } else if (selectedButton === "WhiteBg") {
      setSelectedWhiteBg([...selectedWhiteBg, ...imageSelectedIds]);
    } else if (selectedButton === "Ordinary") {
      setSelectedOrdinary([...selectedOrdinary, ...imageSelectedIds]);
    } else if (selectedButton === "Discard") {
      setSelectedDiscard([...selectedDiscard, ...imageSelectedIds]);
    }

    if (selectedButton === "Thumbnail") {
      if (selectedThumbnail.length > 0) {
        console.log('saim', allImages, selectedThumbnail);
        const newOne = allImages.filter((itm) => imageSelectedIds[0].id !== itm.id)
        setAllImages([...newOne, ...selectedThumbnail])
      } else {
        setAllImages(allImages.filter((itm) => imageSelectedIds[0].id !== itm.id));
      }
    } else {
      setAllImages(allImages.filter((itm) => !imageSelectedIds.includes(itm)));
    }

    setIsThumbnailButtonDisabled(
      selectedButton === "Thumbnail" || selectedThumbnail.length > 0
    );
    setIsDimensionalButtonDisabled(
      selectedButton === "Dimensional" || selectedDimentional.length > 0
    );
    setIsWhiteBgButtonDisabled(
      selectedButton === "WhiteBg" || selectedWhiteBg.length > 0
    );
    setIsOrdinaryButtonDisabled(
      selectedButton === "Ordinary" || selectedOrdinary.length > 0
    );
    setIsDiscardButtonDisabled(
      selectedButton === "Discard" || selectedDiscard.length > 0
    );

    setImageSelectedIds([]);
    if (selectedButton === "Thumbnail") {
      setIsThumbnailButtonDisabled(true);
    } else if (selectedButton === "Dimensional") {
      setIsDimensionalButtonDisabled(true);
    } else if (selectedButton === "WhiteBg") {
      setIsWhiteBgButtonDisabled(true);
    } else if (selectedButton === "Ordinary") {
      setIsOrdinaryButtonDisabled(true);
    } else if (selectedButton === "Discard") {
      setIsDiscardButtonDisabled(true);
    }
    setSelectedButton("")
  };

  // convert sorted data into json form

  const areAllImagesSorted = () => {
    // Check if all categories (Thumbnail, Dimensional, Ordinary, Discard) have been mapped
    const areCategoriesMapped =
      hasThumbnailImagesMapped ||
      hasDimensionalImagesMapped ||
      hasWhiteBgImagesMapped ||
      hasOrdinaryImagesMapped ||
      hasDiscardImagesMapped;

    // Check if all image arrays are empty
    const areImageArraysEmpty =
      selectedThumbnail.length === 0 &&
      selectedDimentional.length === 0 &&
      selectedWhiteBg.length === 0 &&
      selectedOrdinary.length === 0 &&
      selectedDiscard.length === 0;

    return areCategoriesMapped || areImageArraysEmpty;
  };

  const jsonData = () => {
    // initialize an empty object to hold the structured data
    const structuredData = {
      id: {},
      dimensional: [],
      thumbnails: [],
      whitebg: [],
      ordinary: [],
      discard: [],
      not_doable: false,
    };
    structuredData.id = sku;
    if (mergeSelectedDefaultThumbnail.length > 0) {
      structuredData.thumbnails = mergeSelectedDefaultThumbnail;
    }
    if (mergeSelectedDefaultDimension.length > 0) {
      structuredData.dimensional = mergeSelectedDefaultDimension;
    }
    if (selectedWhiteBg.length > 0) {
      structuredData.whitebg = selectedWhiteBg;
    }
    if (selectedOrdinary.length > 0) {
      structuredData.ordinary = selectedOrdinary;
    }
    if (selectedDiscard.length > 0) {
      structuredData.discard = selectedDiscard;
    }
    // if (videos.length > 0) {
    //   structuredData.videos = videos;
    // }

    // Log the structured data as a JSON object.
    // console.log(JSON.stringify(structuredData, null, 2));

    // Define the API endpoint and data payload
    const apiUrl = `${process.env.REACT_APP_SERVER_ADDRESS}/api/submit`;
    // const data = {
    //     key1: 'value1',
    //     key2: 'value2'
    // };

    // Send the POST request
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(structuredData),
    })
      .then((response) => response.json()) // Assuming server responds with json
      .then((structuredData) => {
        console.log("Success:", structuredData);
        setDefaultThumbnail([]);
        setSelectedThumbnail([]);
        setDefaultDimension([]);
        setSelectedDimentional([]);
        setSelectedWhiteBg([]);
        setSelectedOrdinary([]);
        setSelectedDiscard([]);
        setVideos([]);
        setAllImages([]);

        setHasThumbnailImagesMapped(false);
        setHasDimensionalImagesMapped(false);
        setHasWhiteBgImagesMapped(false);
        setHasOrdinaryImagesMapped(false);
        setHasDiscardImagesMapped(false);

        // Enable the other buttons
        setIsThumbnailButtonDisabled(false);
        setIsDimensionalButtonDisabled(false);
        setIsWhiteBgButtonDisabled(false);
        setIsOrdinaryButtonDisabled(false);
        setIsDiscardButtonDisabled(false);

        // ENABLE DISABLE BUTTON ON SUBMIT SORTED DATA
        setIsFetchButtonDisabled(false);

        setVisibilityNotDoable(false);

        toast.success("Sorted Data Submit Successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });

        setSearchQuery("")

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const executeNoDoAbleScript = () => {
    console.log("click");
    // initialize an empty object to hold the structured data
    const structuredData = {
      id: {},
      sku: "",
      dimensional: [],
      thumbnails: [],
      unsorted: [],
      not_doable: true,
      change: 'rejected_nad',
    };
    structuredData.id = sku;
    structuredData.sku = showId;
    structuredData.thumbnails = defaultThumbnail;
    structuredData.dimensional = defaultDimension;
    structuredData.unsorted = allImages;

    // Define the API endpoint and data payload
    const apiUrl = `${process.env.REACT_APP_SERVER_ADDRESS}/api/submit`;

    // Send the POST request
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(structuredData),
    })
      .then((response) => response.json()) // Assuming server responds with json
      .then((structuredData) => {
        console.log("Success:", structuredData);
        setDefaultThumbnail([]);
        setSelectedThumbnail([]);
        setDefaultDimension([]);
        setSelectedDimentional([]);
        setSelectedWhiteBg([]);
        setSelectedOrdinary([]);
        setSelectedDiscard([]);
        setVideos([]);
        setAllImages([]);

        setHasThumbnailImagesMapped(false);
        setHasDimensionalImagesMapped(false);
        setHasWhiteBgImagesMapped(false);
        setHasOrdinaryImagesMapped(false);
        setHasDiscardImagesMapped(false);

        // Enable the other buttons
        setIsThumbnailButtonDisabled(false);
        setIsDimensionalButtonDisabled(false);
        setIsWhiteBgButtonDisabled(false);
        setIsOrdinaryButtonDisabled(false);
        setIsDiscardButtonDisabled(false);

        // ENABLE DISABLE BUTTON ON SUBMIT SORTED DATA
        setIsFetchButtonDisabled(false);

        setVisibilityNotDoable(false);

        toast.success("Not Doable Product Submited Successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  // const [selectedThumbnail, setSelectedThumbnail] = useState([]);
  // const [selectedDimentional, setSelectedDimentional] = useState([]);
  // const [selectedWhiteBg, setSelectedWhiteBg] = useState([]);
  // const [selectedOrdinary, setSelectedOrdinary] = useState([]);

  useEffect(() => {
    if (selectedThumbnail.length === 0) {
      setIsThumbnailButtonDisabled(false)
    }
  }, [selectedThumbnail])

  useEffect(() => {
    if (selectedDimentional.length === 0) {
      setIsDimensionalButtonDisabled(false)
    }
  }, [selectedDimentional])

  useEffect(() => {
    if (selectedWhiteBg.length === 0) {
      setIsWhiteBgButtonDisabled(false)
    }
  }, [selectedWhiteBg])

  useEffect(() => {
    if (selectedOrdinary.length === 0) {
      setIsOrdinaryButtonDisabled(false)
    }
  }, [selectedOrdinary])

  useEffect(() => {
    if (selectedDiscard.length === 0) {
      setIsDiscardButtonDisabled(false)
    }
  }, [selectedDiscard])


  return (
    <>
      {/* {console.log("updated data", );} */}
      <HeaderSignOut
        userEmail={props.userEmail}
        userRole={props.userRole}
        userJdesc={props.userJdesc}
        user={props.user}
      />
      {/* <Sidebar /> */}
      <div className="set-right-container" style={{ position: 'relative' }}>
        {/* header section  */}
        <div className="header">
          <div className="set-container">
            <div className="d-flex flex-row align-items-center justify-content-between">
              {/* <div className="col-lg-4 col-md-4 offset-1 offset-md-0">
                <div className="search-box d-flex align-items-center justify-content-between">
                  <i className="fa fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search url..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div> */}
              <div className="">
                <h6>
                  Product ID: <strong>{showId}</strong>
                </h6>
              </div>
              <div className="">
                {visibilityNotDoable === true ? (
                  <button
                    className="set-btn-red d-block w-100"
                    onClick={executeNoDoAbleScript}
                  >
                    Mark as Not Doable and Skip
                  </button>
                ) : (
                  ""
                )}
              </div>
              {/* <div className="col-lg-3 col-md-4 text-end">
                <button
                  className="btn d-block w-100"
                  onClick={executePythonScript}
                  disabled={isFetchButtonDisabled}
                >
                  Fetch Data
                </button>
              </div> */}
              <div className="d-flex flex-row align-items-center gap-1">
                <div className="d-flex">
                  <input className="w-100 px-3" placeholder="Search By URL" style={{ backgroundColor: "#e8e8e8" }} value={searchQuery} disabled={isFetchButtonDisabled} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button
                    id="btn-go"
                    className="btn p-2 px-3  btn-go-fetch"

                    onClick={executePythonScript}
                    disabled={isFetchButtonDisabled}
                  >
                    GO
                  </button>
                </div>
                <h5 className="m-0" style={{ textAlign: 'center' }}>or</h5>
                <button
                  id="btn-fetch"
                  className="btn d-block btn-fetch"
                  onClick={executePythonScript}
                  disabled={isFetchButtonDisabled}
                >
                  Fetch Data
                </button>
              </div>
              {/* <div className="col-lg-1 col-md-4 text-end">
              <button onClick={handleSignOut}>SignOut</button>
            </div> */}
            </div>
          </div>
        </div>

        {/* radio selector  */}
        <div className="mt-5 set-fixed-bar">
          <div className="inside-div">
            {/* <div>
            <h2>JSON Result:</h2>
            <pre>{jsonResult}</pre>
          </div> */}
            <button
              onClick={() => handleButtonClick("Thumbnail")}
              className={`fw-bold select-btn btn ${selectedButton === "Thumbnail" ? "active-button" : ""
                }${isThumbnailButtonDisabled ? " button-disable" : ""}`}
              disabled={isThumbnailButtonDisabled}
            >
              Thumbnail
            </button>

            <button
              onClick={() => handleButtonClick("Dimensional")}
              className={`fw-bold select-btn btn ${selectedButton === "Dimensional" ? "active-button" : ""
                }
              ${isDimensionalButtonDisabled ? " button-disable" : ""}`}
              disabled={isDimensionalButtonDisabled}
            >
              Dimensional
            </button>
            <button
              onClick={() => handleButtonClick("WhiteBg")}
              className={`fw-bold select-btn btn ${selectedButton === "WhiteBg" ? "active-button" : ""
                }${isWhiteBgButtonDisabled ? " button-disable" : ""}`}
              disabled={isWhiteBgButtonDisabled}
            >
              WhiteBg
            </button>
            <button
              onClick={() => handleButtonClick("Ordinary")}
              className={`fw-bold select-btn btn btn-equ ${selectedButton === "Ordinary" ? "active-button" : ""
                }${isOrdinaryButtonDisabled ? " button-disable" : ""}`}
              disabled={isOrdinaryButtonDisabled}
            >
              Supportive
            </button>

            <button
              onClick={() => handleButtonClick("Discard")}
              className={`fw-bold select-btn btn btn-equ ${selectedButton === "Discard" ? "active-button" : ""
                }${isDiscardButtonDisabled ? " button-disable" : ""}`}
              disabled={isDiscardButtonDisabled}
            >
              Discard
            </button>
            <button
              onClick={submitData}
              className="submit mt-3"
              id="set-btn-submit"
            >
              Submit
            </button>

          </div>

          <div className="w-100 mt-5">
            {mergeSelectedDefaultThumbnail.length > 0 ||
              mergeSelectedDefaultDimension.length > 0 ||
              selectedWhiteBg.length > 0 ||
              selectedOrdinary.length > 0 ||
              selectedDiscard.length > 0 ? (
              <button
                onClick={jsonData}
                className={`w-100 btn-danger ${areAllImagesSorted() ? "disabled" : ""}`}

                disabled={!areAllImagesSorted()}
              >
                COMPLETED
              </button>
            ) : (
              <button className={`btn-danger disabled`} disabled>
                COMPLETED
              </button>
            )}
          </div>
        </div>

        {/* all images map in ui  */}

        <div className="container-fluid">
          <div className="d-flex gap-2 flex-wrap" style={{ marginRight: "152px" }}>
            {allImages.map((item) => (
              <div className="mt-4" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                <div
                  className={`card img-fluid ${imageSelectedIds.includes(item) ? "selected-image" : ""}`}
                  onClick={() => selectMyItem(item)}
                >
                  <img src={item.src} id={`img-${item.id}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* submit button  */}
        {/* <div className="col-lg-10 col-md-4 text-end">
          <button onClick={submitData} className="btn btn-primary submit">
            Submit
          </button>
        </div> */}

        {/* <h2 className="text-center mb-5">Sorted Data</h2> */}
        {/* thumbnai section images  */}
        <div className="container-fluid py-2 thumbnail-bg mt-4">
          <div className="" style={{ marginRight: "152px" }}>
            <div className="main-div">
              <div className=" row">
                <div className="col-lg-12">
                  <h3 className="m-0 p-0">Thumbnail</h3>
                </div>
                <div className="d-flex align-items-start flex-wrap">
                  <div>
                    <div className="all-btns">
                      {selectedThumbnail.length > 0 && selectedImage && (
                        <div className="d-flex">
                          <div>
                            <h4 className="set-f4">My Selection</h4>
                          </div>
                          <div className="ms-3">
                            <div className="mb btn-click all-btn ">
                              {isThumbnailEditMode ? (
                                <>
                                  <button
                                    onClick={saveImages}
                                    className="btn me-3 save"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => editImages("Thumbnail")}
                                    className="btn edit"
                                  >
                                    Edit
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => editImages("Thumbnail")}
                                  className="btn edit"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row">
                      {selectedThumbnail.map((item) => (
                        <div className="mb-2" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                          <div
                            className={`card ${isThumbnailEditMode ? "edit-mode" : ""
                              }`}
                            onClick={() => selectMyItem(item)}
                          >
                            {isThumbnailEditMode && (
                              <div
                                className="cross"
                                onClick={() => resetThumbnailImage(item)}
                              >
                                <CancelIcon />
                              </div>
                            )}
                            <img
                              className="card-img-top img-fluid"
                              src={item.src}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="d-flex">
                      <div>
                        <h4 className="set-f4">Default</h4>
                      </div>
                      <div className="ms-3">
                        {/*  // ! &&&&&&&&&&&&&&&&&&&&&&&&&& ! DEFAULT THUMBNAIL IMAGES METHOS START ******************************************************************* */}
                        {!isDefaultThumbnailEditMode && (
                          <button
                            onClick={() => handleDefaultThumbnailEdit(true)}
                            className="btn edit d btn-width-auto"
                          >
                            Edit
                          </button>
                        )}
                        {isDefaultThumbnailEditMode && (
                          <>
                            <>
                              <button
                                onClick={saveImages}
                                className="btn me-3 save btn-width-auto"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => handleDefaultThumbnailEdit(false)}
                                className="btn edit btn-width-auto"
                              >
                                Cancel
                              </button>
                            </>
                          </>
                        )}
                      </div>
                    </div>

                    {/*  // ! &&&&&&&&&&&&&&&&&&&&&&&&&& ! DEFAULT THUMBNAIL IMAGES METHOS END ******************************************************************* */}
                    <div className="row">
                      {defaultThumbnail.map((item) => (
                        <div className="col-md-2 mb-2" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                          <div
                            className={`card ${isDefaultThumbnailEditMode ? "edit-mode" : ""
                              }`}
                            onClick={() => selectMyItem(item)}
                          >
                            {isDefaultThumbnailEditMode && (
                              <div
                                className="cross"
                                onClick={() => resetDefaultThumbnail(item)}
                              >
                                <CancelIcon />
                              </div>
                            )}
                            <img
                              className="card-img-top img-fluid"
                              src={item.src}
                              alt=""
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* dimentional images section  */}
        <div className="container-fluid py-1 dimensnal-bg">
          <div style={{ marginRight: "152px" }}>
            <div className="main-div">
              <div className="row">
                <div className="col-lg-12">
                  <h3 className="m-0 p-0">Dimentional</h3>
                </div>
                <div className="d-flex align-align-items-start flex-wrap">
                  <div>
                    <div className="all-btns">
                      {selectedDimentional.length > 0 && selectedImage && (
                        <div className="d-flex">
                          <div>
                            <h4 className="set-f4">My Selection</h4>
                          </div>
                          <div className="ms-3 mb btn-click all-btn ">
                            {isDimensionalEditMode ? (
                              <>
                                <button
                                  onClick={saveImages}
                                  className="btn me-3 save"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => editImages("Dimensional")}
                                  className="btn edit"
                                >
                                  Edit
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => editImages("Dimensional")}
                                className="btn edit"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="row">
                        {selectedDimentional.map((item) => (
                          <div className="mb-2" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                            <div
                              className={`card ${isDimensionalEditMode ? "edit-mode" : ""
                                }`}
                              onClick={() => selectMyItem(item)}
                            >
                              {isDimensionalEditMode && (
                                <div
                                  className="cross"
                                  onClick={() => resetDimensionalImage(item)}
                                >
                                  <CancelIcon />
                                </div>
                              )}
                              <img
                                className="card-img-top img-fluid"
                                src={item.src}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex">
                      <div>
                        <h4 className="set-f4">Default</h4>
                      </div>
                      <div className="ms-3">
                        {/* ! DIMESNIONAL DEFAULT IMAGES METHOD START   */}
                        {!isDefaultDimensionEditMode ? (
                          <button
                            onClick={() => handleDefaultDimensionEdit(true)}
                            className="btn btn-block edit btn-width-auto"
                          >
                            Edit
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={saveImages}
                              className="btn btn-block me-3 save btn-width-auto"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => handleDefaultDimensionEdit(false)}
                              className="btn btn-block edit btn-width-auto"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      {defaultDimension
                        ? defaultDimension.map((item) => (
                          <div className="mb-2" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                            <div
                              className={`card ${isDefaultDimensionEditMode ? "edit-mode" : ""
                                }`}
                              onClick={() => selectMyItem(item)}
                            >
                              {isDefaultDimensionEditMode && (
                                <div
                                  className="cross"
                                  onClick={() => resetDefaultDimension(item)}
                                >
                                  <CancelIcon />
                                </div>
                              )}
                              <img
                                className="card-img-top img-fluid"
                                src={item.src}
                              />
                            </div>
                          </div>
                        ))
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* white bg section  */}
        <div className="container-fluid py-1 white-bg">
          <div style={{ marginRight: "152px" }}>
            <div className="main-div">
              <div className="row">
                <div className="col-lg-12">
                  <h3 className="m-0 p-0">White BG</h3>
                </div>
                <div>
                  <div className="all-btns">
                    {selectedWhiteBg.length > 0 && selectedImage && (
                      <div className="d-flex">
                        <div>
                          <h4 className="set-f4">My Selection</h4>
                        </div>
                        <div className="mb btn-click all-btn ms-3">
                          {isWhiteBgEditMode ? (
                            <>
                              <button
                                onClick={saveImages}
                                className="btn me-3 save"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => editImages("WhiteBg")}
                                className="btn edit"
                              >
                                Edit
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => editImages("WhiteBg")}
                              className="btn edit"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="row">
                      {selectedWhiteBg.map((item) => (
                        <div className="mb-2" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                          <div
                            className={`card ${isWhiteBgEditMode ? "edit-mode" : ""
                              }`}
                            onClick={() => selectMyItem(item)}
                          >
                            {isWhiteBgEditMode && (
                              <div
                                className="cross"
                                onClick={() => resetWhiteBg(item)}
                              >
                                <CancelIcon />
                              </div>
                            )}
                            <img
                              className="card-img-top img-fluid"
                              src={item.src}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ordinary images section  */}
        <div className="container-fluid py-1 ordinary-b">
          <div style={{ marginRight: "152px" }}>
            <div className="main-div">
              <div className="row">
                <div className="col-lg-12">
                  <h3 className="m-0 p-0">Supportive</h3>
                </div>
                <div className="all-btns">
                  {selectedOrdinary.length > 0 && selectedImage && (
                    <div className="d-flex">
                      <div>
                        <h4 className="set-f4">My Selection</h4>
                      </div>
                      <div className="mb btn-click all-btn ms-3">
                        {isOrdinarylEditMode ? (
                          <>
                            <button
                              onClick={saveImages}
                              className="btn me-3 save"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => editImages("Ordinary")}
                              className="btn edit"
                            >
                              Edit
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => editImages("Ordinary")}
                            className="btn edit"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="row">
                    {selectedOrdinary.map((item) => (
                      <div className="mb-2" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                        <div
                          className={`card ${isOrdinarylEditMode ? "edit-mode" : ""
                            }`}
                          onClick={() => selectMyItem(item)}
                        >
                          {isOrdinarylEditMode && (
                            <div
                              className="cross"
                              onClick={() => resetOrdinaryImages(item)}
                            >
                              <CancelIcon />
                            </div>
                          )}
                          <img
                            className="card-img-top img-fluid"
                            src={item.src}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid py-1 discard-bg">
          <div style={{ marginRight: "152px" }}>
            <div className="main-div">
              <div className="row">
                <div className="col-lg-12">
                  <h3 className="m-0 p-0">Discard</h3>
                </div>
                <div className="all-btns">
                  {selectedDiscard.length > 0 && selectedImage && (
                    <div className="d-flex">
                      <div>
                        <h4 className="set-f4">My Selection</h4>
                      </div>
                      <div className="mb btn-click all-btn ms-3">
                        {isDiscardlEditMode ? (
                          <>
                            <button
                              onClick={saveImages}
                              className="btn me-3 save"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => editImages("Discard")}
                              className="btn edit"
                            >
                              Edit
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => editImages("Discard")}
                            className="btn edit"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="row">
                    {selectedDiscard.map((item) => (
                      <div className="mb-2" key={item.id} style={{ width: '180px', marginLeft: '20px' }}>
                        <div
                          className={`card ${isDiscardlEditMode ? "edit-mode" : ""
                            }`}
                          onClick={() => selectMyItem(item)}
                        >
                          {isDiscardlEditMode && (
                            <div
                              className="cross"
                              onClick={() => resetDiscardImage(item)}
                            >
                              <CancelIcon />
                            </div>
                          )}
                          <img
                            className="card-img-top img-fluid"
                            src={item.src}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* VIDEO CONTAINER */}
        {/* <div className="container-fluid py-3 video-bg">
          <div className="container">
            <div className="main-div">
              <div className="row">
                <div className="col-lg-12">
                  <h2 className="mb-3">Videos</h2>
                </div>

                <div className="col-lg-12">
                  <div className="row">
                    {videos
                      ? videos.map((item) => (
                          <>
                            <div className="col-12">
                              <div>
                                <h4 className="set-f4">Default</h4>
                              </div>
                            </div>
                            <div className="col-md-2 mb-2" key={item.id}>
                              <div
                                className={`card ${
                                  isDiscardlEditMode ? "edit-mode" : ""
                                }`}
                                onClick={() => selectMyItem(item)}
                              >
                                {isDiscardlEditMode && (
                                  <div
                                    className="cross"
                                    onClick={() => resetDiscardImage(item)}
                                  >
                                    <CancelIcon />
                                  </div>
                                )}
                                <img
                                  className="card-img-top img-fluid"
                                  src={item.poster}
                                />
                              </div>
                            </div>
                          </>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* sorted data into json form  */}

        {/* <div className="col-lg-10 col-md-4 text-end mt-4 mb-5 infosync-skicky-button">
          {mergeSelectedDefaultThumbnail.length > 0 ||
            mergeSelectedDefaultDimension.length > 0 ||
            selectedWhiteBg.length > 0 ||
            selectedOrdinary.length > 0 ||
            selectedDiscard.length > 0 ? (
            <button
              onClick={jsonData}
              className={`btn-danger ${areAllImagesSorted() ? "disabled" : ""}`}
              disabled={!areAllImagesSorted()}
            >
              COMPLETED
            </button>
          ) : (
            <button className={`btn-danger disabled}`} disabled>
              COMPLETED
            </button>
          )}
        </div> */}
      </div >
      <footer>
        <div className="col-lg-12">
          <div className="footer-left">
            <p className="mb-0">@InfoSync LTD 2015 All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Extraction;
