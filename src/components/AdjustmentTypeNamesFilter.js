import { useEffect, useState } from "react";

const AdjustmentTypeNamesFilter = ({ initialAdjustmentTypeNames, adjustmentTypeNames, setAdjustmentTypeNames }) => {

    //console.log("adjustmentTypeNames:", adjustmentTypeNames);
    
    const [checkedTypes, setCheckedTypes] = useState({});

    //console.log("checkedTypes:", checkedTypes);

    useEffect(() => {
        const initialCheckedTypes = adjustmentTypeNames.map(a => ({ [a]: true })).reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});

        //console.log("initialCheckedTypes:", initialCheckedTypes);

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
            //console.log("newAdjustmentTypeNames:", newAdjustmentTypeNames);

            return newAdjustmentTypeNames;
        });
    }

    return (
        <div className="card">
            <div className="card-body">
            <p className="mb-4"><b>Choose your desired adjustment properties</b></p>
            <div className="form-group d-flex " style={{columnGap: 40}}>
            {initialAdjustmentTypeNames.map((adjustmentTypeName, index) => (
                //console.log("adjustmentTypeName:", adjustmentTypeName),
                //console.log("checkedTypes[adjustmentTypeName]:", checkedTypes[adjustmentTypeName]),

                <div key={index} className="form-check">
                    <input className="form-check-input" type="checkbox" checked={checkedTypes[adjustmentTypeName] || false} onChange={handleCheckboxChange} name={adjustmentTypeName} />
                    <label className="form-check-label">{adjustmentTypeName}</label>
                </div>
            ))}
            </div>
            

            {/* <div className="card">
                <div className="card-body">
                <p className="mb-4"><b>Choose your desired adjustment properties</b></p>
                <div className="form-group d-flex " style={{columnGap: 40}}>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">RC</label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Usage</label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">NRC</label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">Recommended</label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">My Favorites</label>
                    </div>
                </div>
                </div>
            </div> */}


            </div>
        </div>
    );
}

export default AdjustmentTypeNamesFilter;
