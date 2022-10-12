import React, { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function ApartmentsForm({
  // apartments,
  // setApartments,
  addShortlet,
  contract,
  cUSDBalance,
  Loading,
  connectToWallet,
}) {
  const [editProfileFormData, setEditProfileFormDate] = useState({
    id: uuidv1(),
    image: "",
    typeOfApartment: "",
    location: "",
    numberOfBedroom: "",
    wifi: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfileFormDate({ ...editProfileFormData, [name]: value });
  };

  function handSubmit(e) {
    e.preventDefault();

    addShortlet(
      editProfileFormData.typeOfApartment,
      editProfileFormData.image,
      editProfileFormData.location,
      editProfileFormData.wifi,
      editProfileFormData.numberOfBedroom,
      editProfileFormData.amount
    );
  }
  return (
    <form onSubmit={(e) => handSubmit(e)}>
      <div className="container my-5">
        <div className="row mt-4 align-items-center">
          <div className="col-md-2">
            <label htmlFor="typeOfApartment" className="col-form-label">
              Type of Apartment{" "}
            </label>
          </div>
          <div className="col-md-10">
            <input
              onChange={(e) => handleChange(e)}
              value={editProfileFormData.typeOfApartment}
              type="text"
              id="typeOfApartment"
              name="typeOfApartment"
              className="form-control"
              aria-describedby="passwordHelpInline"
            />
          </div>
        </div>
        <div className="row mt-4 align-items-center">
          <div className="col-md-2">
            <label htmlFor="image" className="col-form-label">
              Image
            </label>
          </div>
          <div className="col-md-10">
            <input
              onChange={(e) => handleChange(e)}
              value={editProfileFormData.image}
              type="text"
              id="image"
              name="image"
              className="form-control"
              aria-describedby="passwordHelpInline"
            />
          </div>
        </div>
        <div className="row mt-4 align-items-center">
          <div className="col-md-2">
            <label htmlFor="numberOfBedroom" className="col-form-label">
              Number of Bedroom
            </label>
          </div>
          <div className="col-md-10">
            <input
              onChange={(e) => handleChange(e)}
              value={editProfileFormData.numberOfBedroom}
              type="number"
              id="numberOfBedroom"
              name="numberOfBedroom"
              className="form-control"
              aria-describedby="passwordHelpInline"
            />
          </div>
        </div>
        <div className="row mt-4 align-items-center">
          <div className="col-md-2">
            <label htmlFor="Location" className="col-form-label">
              Location{" "}
            </label>
          </div>
          <div className="col-md-10">
            <input
              onChange={(e) => handleChange(e)}
              value={editProfileFormData.location}
              type="text"
              name="location"
              className="form-control"
              aria-describedby="passwordHelpInline"
            />
          </div>
        </div>
        <div className="row mt-4 align-items-center">
          <div className="col-md-2">
            <label htmlFor="Wifi" className="col-form-label">
              Wifi{" "}
            </label>
          </div>
          <div className="col-md-10">
            <input
              onChange={(e) => handleChange(e)}
              value={editProfileFormData.wifi}
              type="text"
              id="Wifi"
              name="wifi"
              className="form-control"
              aria-describedby="passwordHelpInline"
            />
          </div>
        </div>
        <div className="row mt-4 align-items-center">
          <div className="col-md-2">
            <label htmlFor="amount" className="col-form-label">
              Amount{" "}
            </label>
          </div>
          <div className="col-md-10">
            <input
              onChange={(e) => handleChange(e)}
              value={editProfileFormData.amount}
              type="number"
              id="amount"
              name="amount"
              className="form-control"
              aria-describedby="passwordHelpInline"
            />
          </div>
        </div>
      </div>
      <div className="d-flex mt-4">
        {contract !== null && cUSDBalance !== null ? (
          <button type="submit" className="btn btn-primary w-75 ms-auto me-5">
            Add Location
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary w-75 ms-auto me-5"
            onClick={() => {
              connectToWallet();
            }}
          >
            {Loading ? "Loading..." : "Connect to wallet to add a shortlet"}
          </button>
        )}
      </div>
    </form>
  );
}

export default ApartmentsForm;
