import React from "react";

function GalleryImage() {
  return (
    <div className="container-lg">
      <div className="row">
        <div
          className="col-md-4 mx-auto"
          style={{
            maxWidth: "250px",
          }}
        >
          <img
            src="https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?auto=compress&cs=tinysrgb&w=600"
            className="img-fluid rounded mx-auto d-block"
            alt="..."
            style={{
              maxWidth: "250px",
            }}
          />
        </div>
        <div
          className="col-md-4 mx-auto"
          style={{
            maxWidth: "250px",
          }}
        >
          <img
            src="https://images.pexels.com/photos/2029665/pexels-photo-2029665.jpeg?auto=compress&cs=tinysrgb&w=600"
            className="img-fluid rounded mx-auto d-block"
            alt="..."
            style={{
              maxWidth: "250px",
            }}
          />
        </div>
        <div
          className="col-md-4 mx-auto"
          style={{
            maxWidth: "250px",
          }}
        >
          <img
            src="https://images.pexels.com/photos/2029694/pexels-photo-2029694.jpeg?auto=compress&cs=tinysrgb&w=600"
            className="img-fluid rounded mx-auto d-block"
            alt="..."
            style={{
              maxWidth: "250px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default GalleryImage;
