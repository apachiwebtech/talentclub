import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import Draggable from 'react-draggable';
import { BASE_URL } from '../Component/BaseUrl';
import { Link } from 'react-router-dom';
import $ from 'jquery'
const Frame16 = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFiles2, setSelectedFiles2] = useState([]);
    const [selectedFiles3, setSelectedFiles3] = useState([]);
    const [selectedFiles4, setSelectedFiles4] = useState([]);
    const [selectedFiles5, setSelectedFiles5] = useState([]);
    const [selectedFiles6, setSelectedFiles6] = useState([]);
    const [preview, setPreview] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [position1, setPosition1] = useState({ x: 0, y: 0 });
    const [position2, setPosition2] = useState({ x: 0, y: 0 });
    const [position3, setPosition3] = useState({ x: 0, y: 0 });
    const [position4, setPosition4] = useState({ x: 0, y: 0 });
    const [position5, setPosition5] = useState({ x: 0, y: 0 });
    const [id, setId] = useState({});
    const handleFileChange = (event, index) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const updatedFiles = [...selectedFiles];
                updatedFiles[index] = {
                    file,
                    previewURL: reader.result,
                    width: 400, // Set your actual image width
                    height: 300, // Set your actual image height
                };
                setSelectedFiles(updatedFiles);
            };

            reader.readAsDataURL(file);
        }
    };
    const handleFileChange2 = (event, index) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const updatedFiles = [...selectedFiles2];
                updatedFiles[index] = {
                    file,
                    previewURL: reader.result,

                };
                setSelectedFiles2(updatedFiles);
            };

            reader.readAsDataURL(file);
        }
    };
    const handleFileChange3 = (event, index) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const updatedFiles = [...selectedFiles3];
                updatedFiles[index] = {
                    file,
                    previewURL: reader.result,

                };
                setSelectedFiles3(updatedFiles);
            };

            reader.readAsDataURL(file);
        }
    };
    const handleFileChange4 = (event, index) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const updatedFiles = [...selectedFiles5];
                updatedFiles[index] = {
                    file,
                    previewURL: reader.result,

                };
                setSelectedFiles4(updatedFiles);
            };

            reader.readAsDataURL(file);
        }
    };
    const handleFileChange5 = (event, index) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const updatedFiles = [...selectedFiles5];
                updatedFiles[index] = {
                    file,
                    previewURL: reader.result,

                };
                setSelectedFiles5(updatedFiles);
            };

            reader.readAsDataURL(file);
        }
    };
    const handleFileChange6 = (event, index) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const updatedFiles = [...selectedFiles6];
                updatedFiles[index] = {
                    file,
                    previewURL: reader.result,

                };
                setSelectedFiles6(updatedFiles);
            };

            reader.readAsDataURL(file);
        }
    };



    const previewRef = useRef(null);

    const handleScreenshot = () => {
        const timeoutId = setTimeout(() => {
            if (previewRef.current) {
                html2canvas(previewRef.current).then((canvas) => {
                    const screenshotDataUrl = canvas.toDataURL();
                    const screenshotImage = new Image();
                    screenshotImage.src = screenshotDataUrl;
                    screenshotImage.alt = 'Screenshot';
                    screenshotImage.id = 'sshot';
                    screenshotImage.style.maxWidth = '100%';
                    screenshotImage.classList.add('blob');
                    // screenshotImage.style.maxHeight = '400px';

                    document.body.appendChild(screenshotImage);
                    const screenshotBlob = canvas.toBlob((blob) => {
                        const formData = new FormData();
                        formData.append('image', blob, 'screenshot.jpg');
                        formData.append('user_id', localStorage.getItem('user_id'));
                        formData.append('tempid', 16);
                        uploadImageToBackend(formData);
                    }, 'image/jpeg');
                });
                setPreview(true);
            }
        }, 3000);
        return () => clearTimeout(timeoutId);
    };

    const uploadImageToBackend = (formData) => {

        fetch(`${BASE_URL}/sharecard`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setId(data.insertId)
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });

    };

    function hidediv() {
        $('.blob').hide()
    }

    return (
        <div className='text-center' style={{ position: 'relative', paddingTop: "70px" }}>
            {preview ? null : (
                <div ref={previewRef}>

                    <div className='d-flex justify-content-center'>

                        <div className='input1' style={{ overflow: 'hidden', width: "200px", height: "266.6px", background: "#B0E0E6" }}>
                            {selectedFiles4.map((file, index) => (
                                <Draggable
                                    key={index}
                                    position={position3}
                                    onStop={(e, data) => setPosition3({ x: data.x, y: data.y })}
                                >
                                    <div className="frame-prev" style={{ position: 'relative' }}>
                                        <img
                                            src={file.previewURL}
                                            alt={`Preview ${index + 1}`}
                                            width={file.width}
                                            height={file.height}
                                            className={` ${file.width > 400 ? 'height200' : 'width200'} ${file.height > 400 ? 'width200' : 'height200'}`}
                                        />
                                    </div>
                                </Draggable>
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange4(e, 0)}
                                accept="image/*"
                                className='input1'
                                style={{ width: "200px", height: "266.6px" }}
                            />
                        </div>
                        <div className='input1' style={{ overflow: 'hidden', width: "200px", height: "266.6px", background: "#FFA07A" }}>
                            {selectedFiles5.map((file, index) => (
                                <Draggable
                                    key={index}
                                    position={position4}
                                    onStop={(e, data) => setPosition4({ x: data.x, y: data.y })}
                                >
                                    <div className="frame-prev" style={{ position: 'relative' }}>
                                        <img
                                            src={file.previewURL}
                                            alt={`Preview ${index + 1}`}
                                            width={file.width}
                                            height={file.height}
                                            className={` ${file.width > 400 ? 'height200' : 'width200'} ${file.height > 400 ? 'width200' : 'height200'}`}
                                        />
                                    </div>
                                </Draggable>
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange5(e, 0)}
                                accept="image/*"
                                className='input1'
                                style={{ width: "200px", height: "266.6px" }}
                            />
                        </div>



                    </div>

                    <div className='d-flex justify-content-center'>

                        <div className='input2' style={{ overflow: 'hidden', width: "100px", height: "133.3px", background: "#FFB6C1" }}>
                            {selectedFiles2.map((file, index) => (
                                <Draggable
                                    key={index}
                                    position={position1}
                                    onStop={(e, data) => setPosition1({ x: data.x, y: data.y })}
                                >
                                    <div className="frame-prev" style={{ position: 'relative' }}>
                                        <img
                                            src={file.previewURL}
                                            alt={`Preview ${index + 1}`}
                                            width={file.width}
                                            height={file.height}
                                            className={` ${file.width > 400 ? 'height200' : 'width200'} ${file.height > 400 ? 'width200' : 'height200'}`}
                                        />
                                    </div>
                                </Draggable>
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange2(e, 0)}
                                accept="image/*"
                                className='input2'
                                style={{ width: "100px", height: "133.3px" }}
                            />
                        </div>



                        <div className='input1' style={{ overflow: 'hidden', width: "100px", height: "133.3px", background: "#FFA07A" }}>
                            {selectedFiles.map((file, index) => (
                                <Draggable
                                    key={index}
                                    position={position}
                                    onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
                                >
                                    <div className="frame-prev" style={{ position: 'relative' }}>
                                        <img
                                            src={file.previewURL}
                                            alt={`Preview ${index + 1}`}
                                            width={file.width}
                                            height={file.height}
                                            className={` ${file.width > 400 ? 'height200' : 'width200'} ${file.height > 400 ? 'width200' : 'height200'}`}
                                        />
                                    </div>
                                </Draggable>
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 0)}
                                accept="image/*"
                                className='input1'
                                style={{ width: "100px", height: "133.3px" }}
                            />
                        </div>

                        <div className='input2' style={{ overflow: 'hidden', width: "100px", height: "133.3px", background: "#D8BFD8" }}>
                            {selectedFiles3.map((file, index) => (
                                <Draggable
                                    key={index}
                                    position={position2}
                                    onStop={(e, data) => setPosition2({ x: data.x, y: data.y })}
                                >
                                    <div className="frame-prev" style={{ position: 'relative' }}>
                                        <img
                                            src={file.previewURL}
                                            alt={`Preview ${index + 1}`}
                                            width={file.width}
                                            height={file.height}
                                            className={` ${file.width > 400 ? 'height200' : 'width200'} ${file.height > 400 ? 'width200' : 'height200'}`}
                                        />
                                    </div>
                                </Draggable>
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange3(e, 0)}
                                accept="image/*"
                                className='input2'
                                style={{ width: "100px", height: "133.3px" }}
                            />
                        </div>

                        <div className='input2' style={{ overflow: 'hidden', width: "100px", height: "133.3px", background: "#B0E0E6" }}>
                            {selectedFiles6.map((file, index) => (
                                <Draggable
                                    key={index}
                                    position={position5}
                                    onStop={(e, data) => setPosition5({ x: data.x, y: data.y })}
                                >
                                    <div className="frame-prev" style={{ position: 'relative' }}>
                                        <img
                                            src={file.previewURL}
                                            alt={`Preview ${index + 1}`}
                                            width={file.width}
                                            height={file.height}
                                            className={` ${file.width > 400 ? 'height200' : 'width200'} ${file.height > 400 ? 'width200' : 'height200'}`}
                                        />
                                    </div>
                                </Draggable>
                            ))}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange6(e, 0)}
                                accept="image/*"
                                className='input2'
                                style={{ width: "100px", height: "133.3px" }}
                            />
                        </div>

                    </div>







                </div>
            )}

            {preview ? null : <button className='btn btn-primary my-2' onClick={handleScreenshot}>Preview</button>}
            {preview ? <Link to={`/generatecard/${id}`}><button className='btn btn-primary g-button ' onClick={hidediv} >Generate Card</button></Link> : null}
        </div>
    );
};

export default Frame16;