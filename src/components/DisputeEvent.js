
const DisputeEvent = ({ dispute }) => {
  return (
    <>
        <div className="row mb-3">
            <div className="form-group col-sm-2">
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
            </div>
            <div className="form-group col-sm-2">
            <button type="submit" className="btn btn-default">Get events</button>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
            <div className="form-group">
                <div className="form-check">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">Select all events</label>
                </div>
            </div>
            <div className="table-responsive" style={{height: 300}}>
                <table className="table table-head-fixed text-nowrap table-bordered table-hover">
                <thead>
                    <tr>
                    <th>Adju</th>
                    <th>Adjust amount</th>
                    <th>To number</th>
                    <th>Call type</th>
                    <th>Call date</th>
                    <th>Duration (sec)</th>
                    <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        </div>    
    </>
  );
}

export default DisputeEvent;
