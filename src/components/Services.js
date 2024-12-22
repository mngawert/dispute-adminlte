
const Services = ({services, selectedService, setSelectedService}) => {
  return (
    <>
        <div className="form-group">
            <label>Service Numbers</label>
            <div className="table-responsive" style={{height: 200, border: '1px solid #dee2e6'}}>
            <table className="table table-as-list text-nowrap table-hover">
                <tbody>
                {services.map((service, index) => (
                    <tr key={index} onClick={() => setSelectedService(service)} className={selectedService?.serviceNum === service.serviceNum ? 'selected' : ''} >
                        <td>{service.serviceNum}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    </>
  );
};

export default Services;
