import { useEffect, useState } from "react";

const AdjustmentTypeNamesFilter = ({ initialAdjustmentTypeNames, adjustmentTypeNames, setAdjustmentTypeNames }) => {
    const [checkedTypes, setCheckedTypes] = useState({});

    useEffect(() => {
        const initialCheckedTypes = adjustmentTypeNames.map(a => ({ [a]: true })).reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});

        setCheckedTypes(initialCheckedTypes);
    }, [adjustmentTypeNames]);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        setCheckedTypes(prevState => ({
            ...prevState,
            [name]: checked
        }));
        setAdjustmentTypeNames(prevState => {
            const newAdjustmentTypeNames = checked ? [...prevState, name] : prevState.filter(a => a !== name);
            return newAdjustmentTypeNames;
        });
    }

    return (
        <div className="form-group">
            <label>Choose your desired adjustment properties</label>
            <div className="form-group d-flex" style={{columnGap: 20}}>
                {initialAdjustmentTypeNames.map((adjustmentTypeName, index) => (
                    <div key={index} className="form-check">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={checkedTypes[adjustmentTypeName] || false} 
                            onChange={handleCheckboxChange} 
                            name={adjustmentTypeName} 
                        />
                        <label className="form-check-label">{adjustmentTypeName}</label>
                    </div>
                ))}
            </div>
            
            {/* <small className="form-text text-muted">
                {Object.values(checkedTypes).filter(Boolean).length} properties selected
            </small> */}
        </div>
    );
}

export default AdjustmentTypeNamesFilter;
