import "./App.css";
import ApartmentsCard from "./components/ApartmentsCard/ApartmentsCard";
import GalleryImage from "./components/GalleryImage/GalleryImage";
import ApartmentsForm from "./components/ApartmentsForm/ApartmentsForm";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// web3 imports

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";

import SHORTLET from "./contracts/SHORTLET.abi.json";
import IERC from "./contracts/IERC.abi.json";
import { render } from "@testing-library/react";

const ERC20_DECIMALS = 18;

const contractAddress = "0x6fF1b87471D59d0e7548e0B720d40176d6066458";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [contract, setcontract] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [shortlets, setShortlets] = useState([]);
  const [shortletLoading, setShortletsLoading] = useState(true);

  // const [apartments, setApartments] = useState([
  //   {
  //     id: uuidv4(),
  //     imageUrl:
  //       "https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     typeOfApartment: "Apartment 1",
  //     location: "Lugbe",
  //     numberOfBedroom: 12,
  //     wifi: true,
  //     amount: 1300,
  //     likes: 13,
  //   },
  //   {
  //     id: uuidv4(),
  //     imageUrl:
  //       "https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     typeOfApartment: "Apartment 2",
  //     location: "Bako",
  //     numberOfBedroom: 6,
  //     wifi: true,
  //     amount: 700,
  //     likes: 8,
  //   },
  //   {
  //     id: uuidv4(),
  //     imageUrl:
  //       "https://images.pexels.com/photos/1287441/pexels-photo-1287441.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     typeOfApartment: "Apartment 3",
  //     location: "Abaji",
  //     numberOfBedroom: 4,
  //     wifi: true,
  //     amount: 300,
  //     likes: 3,
  //   },
  // ]);

  const connectToWallet = async () => {
    setLoading(true);
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        setAddress(user_address);
        setKit(kit);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      setLoading(false);
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(SHORTLET, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  const getShortlets = useCallback(async () => {
    const shortletLength = await contract.methods.getShortletLength().call();
    console.log(shortletLength);
    const shortlets = [];
    for (let index = 0; index < shortletLength; index++) {
      let _shortlets = new Promise(async (resolve, reject) => {
        let shortlet = await contract.methods.getShortlet(index).call();

        resolve({
          index: index,
          owner: shortlet[0],
          typeOfApartment: shortlet[1],
          image: shortlet[2],
          location: shortlet[3],
          wifi: shortlet[4],
          numberOfBedroom: shortlet[5],
          amount: shortlet[6],
          likes: shortlet[7],
        });
      });
      shortlets.push(_shortlets);
    }

    const _shortlets = await Promise.all(shortlets);
    setShortlets(_shortlets);
    setShortletsLoading(false);
  }, [contract]);

  useEffect(() => {
    if (contract) {
      getShortlets();
    }
  }, [contract, getShortlets]);

  // const likeShortlet = async (_index) => {
  //   // console.log(_index);
  //   // return;
  //   const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
  //   try {
  //     await cUSDContract.methods
  //       .approve(contractAddress, shortlets[_index].like)
  //       .send({ from: address });
  //     await contract.methods.likeShortlet(_index).send({ from: address });
  //     getShortlets();
  //     getBalance();
  //     alert("you have successfully rented a shortlet");
  //   } catch (error) {
  //     alert(error);
  //   }
  // };
  const likeShortlet = async (index) => {
    try {
      await contract.methods.likeShortlet(index).send({ from: address });
    } catch (error) {
      console.log(error);
    } finally {
      getShortlets();
    }
  };
  const rentShortlet = async (_index) => {
    // console.log(_index);
    // return;
    const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
    try {
      await cUSDContract.methods
        .approve(contractAddress, shortlets[_index].amount)
        .send({ from: address });
      await contract.methods.buyShortlet(_index).send({ from: address });
      getShortlets();
      getBalance();
      alert("you have successfully rented a shortlet");
    } catch (error) {
      alert(error);
    }
  };

  const addShortlet = async (
    _typeOfApartment,
    _image,
    _location,
    _wifi,
    _numberOfBedroom,
    _amount
  ) => {
    try {
      let amount = new BigNumber(_amount).shiftedBy(ERC20_DECIMALS).toString();
      await contract.methods
        .addShortlet(
          _typeOfApartment,
          _image,
          _location,
          _wifi,
          _numberOfBedroom,
          amount
        )
        .send({ from: address });
      getShortlets();
    } catch (error) {
      alert(error);
    }
  };

  function likeApartment(id) {
    // console.log(apartments.filter((x) => x.id === id)[0].likes + 1);
  }
  return (
    <div className="App">
      <section className="nav-section">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand fw-5 " href="./index.html">
              SHORT-LET APARTMENTS
            </a>
            {contract !== null && cUSDBalance !== null ? (
              <div className="ms-auto">
                <b>{cUSDBalance} cUSD</b>
              </div>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setLoading(true);
                  connectToWallet();
                }}
              >
                {Loading ? "Loading..." : "Connect"}
              </button>
            )}
          </div>
        </nav>
      </section>
      <section className="hero-section mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="card bg-dark text-white">
                <img
                  src="https://images.pexels.com/photos/1776574/pexels-photo-1776574.jpeg?auto=compress&cs=tinysrgb&w=400"
                  className="card-img"
                  alt="..."
                />
                <div className="card-img-overlay d-flex">
                  {/* <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This is a wider card with supporting text below as a natural
                    lead-in to additional content. This content is a little bit
                    longer.
                  </p> */}
                  <p className="card-text mt-auto fs-3 text-info fw-5">
                    Last updated 3 mins ago
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-none d-md-block">
              <div className="d-flex flex-column">
                <div className="card bg-dark text-white my-1">
                  <img
                    src="https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg?auto=compress&cs=tinysrgb&w=400"
                    className="card-img"
                    alt="..."
                  />
                </div>
                <div className="card bg-dark text-white my-1">
                  <img
                    src="https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=400"
                    className="card-img"
                    alt="..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <h2 className="text-center mt-5">OUR GALLERY</h2>
      <section className="cards-section">
        <GalleryImage />
      </section>

      <section className="mt-5">
        <div className="container">
          <div
            className="card mb-3 mx-auto w-100"
            style={{
              height: "200px",
              overflow: "hidden",
            }}
          >
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src="https://images.pexels.com/photos/2525899/pexels-photo-2525899.jpeg?auto=compress&cs=tinysrgb&w=600"
                  className="img-fluid rounded-start"
                  alt="..."
                  style={{
                    marginTop: "-200px",
                  }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This is a wider card with supporting text below as a natural
                    lead-in to additional content. This content is a little bit
                    longer.
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Last updated 3 mins ago
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <h2 className="text-center mt-5">SHORTLETS</h2>
      <section className="cards-section">
        <div className="container-lg">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {shortletLoading ? (
              <div
                className="w-100 fs-2"
                style={{
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Loading shortlets...
              </div>
            ) : (
              <>
                {shortlets.map((shortlet) => {
                  // console.log(shortlet);
                  const {
                    amount,
                    image,
                    index,
                    likes,
                    location,
                    numberOfBedroom,
                    owner,
                    typeOfApartment,
                    wifi,
                  } = shortlet;

                  return (
                    <div className="col" key={index}>
                      <ApartmentsCard
                        rentShortlet={rentShortlet}
                        imageUrl={image}
                        typeOfApartment={typeOfApartment}
                        location={location}
                        numberOfBedroom={numberOfBedroom}
                        wifi={wifi}
                        amount={amount}
                        likes={likes}
                        id={index}
                        likeShortlet={likeShortlet}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </section>

      <h2 className="text-center mt-5">ADD SHORTLET</h2>
      <section className="my-5">
        <ApartmentsForm
          // apartments={apartments}
          // setApartments={setApartments}
          addShortlet={addShortlet}
          contract={contract}
          cUSDBalance={cUSDBalance}
          Loading={Loading}
          connectToWallet={connectToWallet}
        />
      </section>
      <section className="footer-section mt-5">
        <footer className="d-flex justify-content-around align-items-center py-3 py-4 border-top">
          <a
            href="/"
            className="mx-auto d-block text-muted text-decoration-none lh-1"
          >
            <span className="text-muted">© 2021 Company, Inc</span>
          </a>
        </footer>
      </section>
    </div>
  );
}

export default App;
