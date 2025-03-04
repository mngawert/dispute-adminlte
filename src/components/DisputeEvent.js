
const DisputeEvent = ({costedEvents, selectedCostedEvent, handleSelectCostedEvent, getCostedEvents, selectedInvoiceDataUsage}) => {
  return (
    <>
        <div className="row">
            <div className="form-group col-sm-2">
                <button type="button" className="btn btn-default" onClick={() => getCostedEvents(selectedInvoiceDataUsage)} >Get events</button>
            </div>

        </div>
        <div className="row">
            <div className="col-12">
                <div className="table-responsive" style={{height: 300}}>
                    <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                    <thead>
                        <tr>
                        <th>Calling Number</th>
                        <th>Called Number</th>
                        <th>Call Type</th>
                        <th>Call Date</th>
                        <th>Duration (sec)</th>
                        <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {costedEvents.map((event, index) => (
                        <tr key={index} onClick={() => handleSelectCostedEvent(event)} className={event.eventRef === selectedCostedEvent?.eventRef ? 'selected' : ''} >
                            <td>{event.eventAttr1}</td>
                            <td>{event.eventAttr2}</td>
                            <td>{event.eventAttr4}</td>
                            <td>{new Date(event.eventDtm).toLocaleDateString('en-GB')}</td>
                            <td>{event.eventAttr3}</td>
                            <td>{event.eventCostMny}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>    
    </>
  );
}

export default DisputeEvent;
