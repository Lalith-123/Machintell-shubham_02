import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import styles from "../product.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../../store";
import { sendData } from "../../../APIS/apis";

function SpecificationDetails() {
    const { id } = useSelector((state) => state.product); // id here is used to for entering the data of the specifications to a perticular product_id in backend table
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, seterror] = useState("");
    const dispatch = useDispatch();
    const { specifications } = useSelector((state) => state.product);
    const [specificationsState, setSpecificationsState] =
        useState(specifications);

    const handleInputChange = (value, rowIndex, cellIndex) => {
        setSpecificationsState((prevState) => {
            const updatedSpecificationsState = prevState.map(
                (specification) => [...specification]
            );
            updatedSpecificationsState[rowIndex][cellIndex] = value;
            return updatedSpecificationsState;
        });
    };

    const handleAddRow = () => {
        setSpecificationsState((prevState) => {
            const updatedSpecificationsState = prevState.map(
                (specification) => [...specification]
            );
            updatedSpecificationsState.push(["", "", ""]);
            return updatedSpecificationsState;
        });
    };

    const handleDeleteRow = () => {
        setSpecificationsState((prevState) => {
            return selectedRows.length
                ? prevState.filter((_, index) => !selectedRows.includes(index))
                : prevState.slice(0, -1);
        });
        setSelectedRows([]);
    };

    const toggleRowSelection = (selectedIndex) => {
        setSelectedRows((prevState) => {
            return prevState.includes(selectedIndex)
                ? prevState.filter((index) => index != selectedIndex)
                : [...prevState, selectedIndex];
        });
    };

    const handleSave = async () => {
        if (validation()) {
            console.log("saved");
            dispatch(
                productActions.addProductSpecifications(
                    specificationsState.map((specification) => [
                        ...specification,
                    ])
                )
            );
            // Here data is sending data of specifications to the a=backend table product_specifications
            console.log(specifications)
            const len = specifications.lemght;
            for(let i=0; i<len; i++){
                const requestSpecificationData = {
                    "product_id": id,
                    "product_specifications": specifications[i][0],
                    "product_unit": specifications[i][1],
                    "product_value": specifications[i][2]
                }
                try {
                    const { message, data } = await sendData(requestSpecificationData, "POST", '/addproductspecs');
                    console.log(message, data);
                    // Do something with the response data if needed
                } catch (error) {
                    // Handle errors
                    console.error('Error:', error.message);
                }
            }

            // const requestProductSecData = {
            //     "product_id": id,
            //     "product_sec_fn": secondaryFunctions
            // }
            // try {
            //     const { message, data } = await sendData(requestProductData, "POST", '/addproduct');
            //     console.log(message, data);
            //     // Do something with the response data if needed
            //   } catch (error) {
            //     // Handle errors
            //     console.error('Error:', error.message);
            //   }
        } else {
            console.log("Validation Failed");
        }
    };
    const validation = () => {
        let isValid = true;
        let errorMessage = "";

        if (
            specificationsState.some((row) =>
                row.some((sp) => sp.trim() === "")
            )
        ) {
            errorMessage += "Please enter all details.\n";
            isValid = false;
        }

        seterror(errorMessage);

        return isValid;
    };

    return (
        <div>
            <DynamicTable
                className="dynamic-table"
                headers={["Name", "Units", "Value"]}
                data={specificationsState}
                selectedRows={selectedRows}
                onRowSelection={(index) => setSelectedRows([index])}
                onDeleteRow={handleDeleteRow}
                onInputChange={handleInputChange}
                toggleRowSelection={toggleRowSelection}
            />
            <div className={styles.buttonGroup}>
                <div>
                    <button className={styles.btn2} onClick={handleAddRow}>
                        Add Specification
                    </button>
                </div>
                <div>
                    <button className={styles.btn2} onClick={handleDeleteRow}>
                        Delete Specification
                    </button>
                </div>
                <div>
                    <button className={styles.btn2} onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
            {error && (
                <div className={styles.error}>
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}

export default SpecificationDetails;
