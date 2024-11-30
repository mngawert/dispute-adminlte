import React from 'react';

const CostedEvent = ({ costedEvents, handleSelectCostedEvent, selectedCostedEvent }) => {
  return (
    <div>
        {costedEvents.length > 0 && (
            <div>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Service Number</th>
                    <th>Event Date</th>
                    <th>Call Type</th>
                    <th>Amount</th>
                    <th>Event Ref</th>
                </tr>
                </thead>
                <tbody>
                {costedEvents.map((data, idx) => (
                    <tr
                    key={idx}
                    onClick={() => {
                        handleSelectCostedEvent(data);
                    }}
                    className={(selectedCostedEvent?.eventRef === data.eventRef) ? 'selected' : ''}
                    >
                    <td>{data.eventSource}</td>
                    <td>{new Date(data.eventDtm).toLocaleString()}</td> {/* Convert to short date with time */}
                    <td>{data.eventAttr4}</td>
                    <td>{data.eventCostMny}</td>
                    <td>{data.eventRef}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
    </div>
  );
}

export default CostedEvent;