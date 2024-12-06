import React, { useState } from 'react';
import api from "../api";

const ReviewBak = () => {
    const [accountNum, setAccountNum] = useState('');
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleInputChange = (e) => {
        setAccountNum(e.target.value);
    };

    const handleRowClick = (index) => {
        setSelectedRow(index);
    };
    
    const fetchData = async () => {
        try {
            const response = await api.get(`/api/Adjustment/GetAdjustmentRequestesByAccountNum?accountNum=${accountNum}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    return (

        <>
            <section className="content-header">
                <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                    <h1>Review</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active">Dispute</li>
                    </ol>
                    </div>
                </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="invoice p-3 mb-3">
                                <div className="row">
                                    <div className="col-12">
                                        <div>
                                            <div>
                                                <input 
                                                    type="text" 
                                                    value={accountNum} 
                                                    onChange={handleInputChange} 
                                                    placeholder="Enter Account Number" 
                                                />
                                                <button onClick={fetchData}>Fetch Data</button>
                                            </div>
                                            <br />
                                            <div className="table-container">
                                            <table className="table table-bordered table-striped">
                                                <thead>
                                                        <tr>
                                                            <th>Account Number</th>
                                                            <th>Dispute Date</th>
                                                            {/* <th>Bill Sequence</th> */}
                                                            <th>Dispute Money</th>
                                                            {/* <th>Product ID</th>
                                                            <th>CPS ID</th>
                                                            <th>Product Sequence</th>
                                                            <th>Event Reference</th> */}
                                                            <th>Adjustment Type ID</th>
                                                            <th>Service Number</th>
                                                            <th>Invoice Number</th>
                                                            {/* <th>Dispute Sequence</th>
                                                            <th>Adjustment Sequence</th>
                                                            <th>Document Number</th> */}
                                                            <th>Request Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.map((item, index) => (
                                                            <tr key={item.id} onClick={() => handleRowClick(index)} className={selectedRow === index ? 'selected' : ''}>
                                                                <td>{item.accountNum}</td>
                                                                <td>{new Date(item.disputeDtm).toLocaleDateString()}</td>
                                                                {/* <td>{item.billSeq}</td> */}
                                                                <td>{item.disputeMny}</td>
                                                                {/* <td>{item.productId}</td>
                                                                <td>{item.cpsId}</td>
                                                                <td>{item.productSeq}</td>
                                                                <td>{item.eventRef}</td> */}
                                                                <td>{item.adjustmentTypeId}</td>
                                                                <td>{item.serviceNum}</td>
                                                                <td>{item.invoiceNum}</td>
                                                                {/* <td>{item.disputeSeq}</td>
                                                                <td>{item.adjustmentSeq}</td>
                                                                <td>{item.documentNum}</td> */}
                                                                <td>{item.requestStatus}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ReviewBak;
