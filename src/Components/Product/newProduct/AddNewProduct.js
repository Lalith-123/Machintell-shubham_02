import React, { useEffect, useRef, useState } from "react";
import styles from "../product.module.css";
import { useDispatch } from "react-redux";
import { productActions } from "../../../store";
import generateId from "../../../util";
import { sendData } from "../../../APIS/apis";

function AddNewProduct() {
    const nameRef = useRef();
    const fileLocationRef = useRef();
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(productActions.addProductName());
    }, [dispatch]);

    const validation = () => {
        let isValid = true;
        let errorMessage = "";

        // Check if productName is empty
        if (nameRef.current.value.trim() === "") {
            errorMessage += "Please enter product name.\n";
            isValid = false;
        }

        // Check if fileLocation is empty
        if (fileLocationRef.current.value.trim() === "") {
            errorMessage += "Please enter file location.\n";
            isValid = false;
        }

        // Set error message
        setError(errorMessage);

        return isValid;
    };

    const handleSave = async() => {
        // console.log("Saving data...",nameRef,fileLocationRef);
        // const requestData = {
        //     "product_name": nameRef,
        //     "product_id": "hedh",
        //     "File_Location": fileLocationRef
        //   }
        //   try {
        //     const { message, data } = await sendData(requestData, "POST", '/addproduct');
        //     console.log(message, data);
        //     // Do something with the response data if needed
        //   } catch (error) {
        //     // Handle errors
        //     console.error('Error:', error.message);
        //   }

        // Perform validation
        if (validation()) {
            // add product data to backend
            dispatch(
                productActions.addProduct({
                    name: nameRef.current.value,
                    fileLocation: fileLocationRef.current.value,
                    id: generateId(nameRef.current.value, "p"),
                })
            );
            // console.log(nameRef.current.value,fileLocationRef.current.value,generateId(nameRef.current.value, "p"))
            // const requestData = {
            //     "product_name": nameRef.current.value,
            //     "product_id": generateId(nameRef.current.value, "p"),
            //     "File_Location": fileLocationRef.current.value
            // }
            // try {
            //     const { message, data } = await sendData(requestData, "POST", '/addproduct');
            //     console.log(message, data);
            //     // Do something with the response data if needed
            //   } catch (error) {
            //     // Handle errors
            //     console.error('Error:', error.message);
            //   }
        } else {
            console.log("Validation failed");
        }
    };

    return (
        <div aria-label="Product Form" className={styles.form}>
            <form>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>
                                    Name of the Product
                                </th>
                                <td className={styles.td}>
                                    <input
                                        ref={nameRef}
                                        className={styles.input}
                                        type="text"
                                        required
                                    />
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className={styles.th}>File location</th>
                                <td className={styles.td}>
                                    <input
                                        ref={fileLocationRef}
                                        className={styles.input}
                                        type="text"
                                        required
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.btn2}
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
            {error && (
                <div className={styles.error}>
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}

export default AddNewProduct;
