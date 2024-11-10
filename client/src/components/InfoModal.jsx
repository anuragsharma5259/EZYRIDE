import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/ModelsStyles/modal.css';

const dummyVehicle = {
  v_image: 'https://imgd.aeplcdn.com/370x208/n/cw/ec/139651/curvv-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
  v_insurance: 'INS123456',
  v_name: 'Toyota Camry',
  v_type: 'Sedan',
  v_desp: 'A comfortable and spacious sedan with excellent fuel efficiency.',
  v_rto: 'MP07',
  v_color: 'White',
  v_mileage: '25 kmpl',
  v_engine_type: 'Hybrid',
  o_no: '9876543210',
  v_pay: '50000',
  v_booked: false,
  v_price: '1500000'
};

const InfoModal = () => {
  return (
    <>
      <Navbar />
      <div className="vehicle-info-container">
        <img src={dummyVehicle.v_image} alt={`${dummyVehicle.v_name}`} className="vehicle-info-image" />
        <h1>{dummyVehicle.v_name}</h1>
        <div className="vehicle-info">
          <form>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="insuranceNumber"><strong>Insurance Number:</strong></label>
                <input type="text" id="insuranceNumber" name="insuranceNumber" defaultValue={dummyVehicle.v_insurance} required readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="vehicleType"><strong>Vehicle Type:</strong></label>
                <input type="text" id="vehicleType" name="vehicleType" defaultValue={dummyVehicle.v_type} required readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description"><strong>Description:</strong></label>
                <textarea 
                    id="description" 
                    name="description" 
                    defaultValue={dummyVehicle.v_desp} 
                    required 
                    readOnly 
                    rows="1" 
                    cols="50" 
                    style={{ resize: 'none', fontSize:'15px',padding:'10px' }}
              />
              </div>
              <div className="form-group">
                <label htmlFor="rto"><strong>RTO:</strong></label>
                <input type="text" id="rto" name="rto" defaultValue={dummyVehicle.v_rto} required readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color"><strong>Color:</strong></label>
                <input type="text" id="color" name="color" defaultValue={dummyVehicle.v_color} required readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="mileage"><strong>Mileage:</strong></label>
                <input type="text" id="mileage" name="mileage" defaultValue={dummyVehicle.v_mileage} required readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="engineType"><strong>Engine Type:</strong></label>
                <input type="text" id="engineType" name="engineType" defaultValue={dummyVehicle.v_engine_type} required readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="ownerNo"><strong>Owner Number:</strong></label>
                <input type="text" id="ownerNo" name="ownerNo" defaultValue={dummyVehicle.o_no} required readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="payment"><strong>Payment Amount:</strong></label>
                <input type="text" id="payment" name="payment" defaultValue={dummyVehicle.v_pay} required readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="booked"><strong>Booked:</strong></label>
                <input type="text" id="booked" name="booked" defaultValue={dummyVehicle.v_booked ? "Yes" : "No"} required readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price"><strong>Price:</strong></label>
                <input type="text" id="price" name="price" defaultValue={dummyVehicle.v_price} required readOnly />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InfoModal;
