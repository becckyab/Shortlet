import React from "react";
import { FaRegThumbsUp } from "react-icons/fa";

function ApartmentsCard({
  id,
  imageUrl,
  typeOfApartment,
  location,
  numberOfBedroom,
  wifi,
  amount,
  likes,
  likeShortlet,
  rentShortlet,
}) {
  return (
    <div
      className="card h-100"
      style={{
        maxWidth: "350px",
        margin: "0 auto",
      }}
    >
      <img
        src={imageUrl}
        className="card-img-top"
        alt="..."
        style={{ height: "250px" }}
      />
      <div className="card-body">
        <h5 className="card-title">{typeOfApartment}</h5>
        <div className="card-text">
          <ul className="nav flex-column">
            <li className="my-2">
              <b>Location:</b> {location}
            </li>
            <li className="my-2">
              <b>Number Of Bedroom:</b> {numberOfBedroom}
            </li>
            <li className="my-2">
              <b>Wif:</b> {wifi ? "Present" : "Not Present"}
            </li>
            <li className="my-2">
              <b>Amount:</b> ${amount / 1000000000000000000}
            </li>
            <li className="my-2">
              <b>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    likeShortlet(id);
                  }}
                >
                  <FaRegThumbsUp />
                </button>
                Likes:
              </b>
              {likes}
            </li>
          </ul>
        </div>
      </div>
      <div className="card-footer">
        {/* <small className="text-muted">Last updated 3 mins ago</small> */}
        <button
          className="btn btn-secondary w-100"
          onClick={() => rentShortlet(id)}
        >
          Rent Shortlet
        </button>
      </div>
    </div>
  );
}

export default ApartmentsCard;
