
const DisputeEvent = ({costedEvents, selectedCostedEvent, handleSelectCostedEvent, getCostedEvents, selectedInvoiceDataUsage}) => {
  return (
    <>
        <div className="row">
            <div className="form-group col-sm-2">
                <button type="button" className="btn btn-default" onClick={() => getCostedEvents(selectedInvoiceDataUsage)} >Get events</button>
            </div>

            {/* <div className="form-group col-sm-2">
                <label>From date:</label>
            </div>
            <div className="form-group col-sm-3">
                <div className="input-group date" id="adjust-minus-from-date" data-target-input="nearest">
                    <input type="text" className="form-control datetimepicker-input" data-target="#adjust-minus-from-date" />
                    <div className="input-group-append" data-target="#adjust-minus-from-date" data-toggle="datetimepicker">
                    <div className="input-group-text"><i className="fa fa-calendar" /></div>
                    </div>
                </div>
            </div>
            <div className="form-group col-sm-2 text-right">
                <label>To date:</label>
            </div>
            <div className="form-group col-sm-3">
                <div className="input-group date" id="adjust-minus-to-date" data-target-input="nearest">
                    <input type="text" className="form-control datetimepicker-input" data-target="#adjust-minus-to-date" />
                    <div className="input-group-append" data-target="#adjust-minus-to-date" data-toggle="datetimepicker">
                    <div className="input-group-text"><i className="fa fa-calendar" /></div>
                    </div>
                </div>
            </div> */}
        </div>
        <div className="row">
            <div className="col-12">
            {/* <div className="form-group">
                <div className="form-check">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">Select all events</label>
                </div>
            </div> */}
            <div className="table-responsive" style={{height: 300}}>
                <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                <thead>
                    <tr>
                    {/* <th>Adju</th> */}
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
                        {/* <td><input type="checkbox" /></td> */}
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
