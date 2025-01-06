import React, { useState } from "react";
import "./components/css/datasheet.css"; 
import Web3 from "web3";
import $ from "jquery";
import init from "./components/init"; 

const SidebarMenu = () => {
  const [tableData, setTableData] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);

  const fetchData = async () => {
    const web3 = new Web3("http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    const promises = accounts.map((account) => fetchAccountData(account));
    await Promise.all(promises);
  };

  const fetchAccountData = async (account) => {
    let storage = await init(); // Ensure 'init' is defined elsewhere and returns the contract instance.
    const user = await storage.methods.get_user(account).call();
    // const asset = await storage.methods.get_asset(account).call();

    if (user[0] === "Not Found") return;

    const newData = {
      account,
      name: user[0],
      gender: user[1],
      // Add other fields as needed
    };

    setTableData((prevData) => [...prevData, newData]);
  };

  const displayRecords = () => {
    fetchData();
    setIsTableVisible(true);
  };

  React.useEffect(() => {
    $(document).ready(function () {
      $(".sub-btn").click(function () {
        $(this).next(".sub-menu").slideToggle();
        $(this).find(".dropdown").toggleClass("rotate");
      });

      $(".menu-btn").click(function () {
        $(".side-bar").addClass("active");
        $(".menu-btn").css("visibility", "hidden");
      });

      $(".close-btn").click(function () {
        $(".side-bar").removeClass("active");
        $(".menu-btn").css("visibility", "visible");
      });
    });
  }, []);

  return (
    <div>
      <div className="menu-btn">
        <i className="fas fa-bars"></i>
      </div>
      <div className="side-bar">
        <div className="close-btn">
          <i className="fas fa-times"></i>
        </div>
        <div className="menu">
          <div className="item">
            <a href="/dashboard">
              <i className="fas fa-desktop"></i>Dashboard
            </a>
          </div>
          <div className="item">
            <a className="sub-btn" href="register.html">
              <i className="fas fa-table"></i>Register
              <i className="fas fa-angle-right dropdown"></i>
            </a>
            <div className="sub-menu">
              <a href="/users" className="sub-item">Users</a>
              <a href="/assets" className="sub-item">Assets</a>
            </div>
          </div>
          <div className="item">
            <a href="/search">
              <i className="fas fa-th"></i>Search
            </a>
          </div>
          <div className="item">
            <a href="/mutation">
              <i className="fa fa-clipboard"></i>Mutation
            </a>
          </div>
          <div className="item">
            <a href="/records">
              <i className="fa fa-database"></i>Records
            </a>
          </div>
          <div className="item">
            <a href="/khatiyan">
              <i className="fa fa-database"></i>Vendor list
            </a>
          </div>
          <div className="item">
            <a className="sub-btn" href="/settings">
              <i className="fas fa-cogs"></i>Settings
              <i className="fas fa-angle-right dropdown"></i>
            </a>
            <div className="sub-menu">
              <a href="user-profile" className="sub-item">User Profile</a>
              <a href="land-data" className="sub-item">Land Data</a>
            </div>
          </div>
        </div>
      </div>

      <section className="main">
        <div id="search">
          <section className="cm-logins">
            <form className="cm-login-form" onSubmit={(e) => e.preventDefault()}>
              <fieldset>
                <center>
                  <legend>Land Record</legend>
                </center>
                <button
                  type="submit"
                  className="cm-submit2"
                  onClick={displayRecords}
                >
                  Click here to see all users land records
                </button>
              </fieldset>
              <br />
              {isTableVisible && (
                <div className="tabledata" id="tableshow">
                  <table id="myytab">
                    <thead>
                      <tr>
                        <th className="head">Account no</th>
                        <th className="head">Name</th>
                        <th className="head">Gender</th>
                        <th className="head">Address</th>
                        <th className="head">Land location</th>
                        <th className="head">District</th>
                        <th className="head">Plot no</th>
                        <th className="head">Area(sqft)</th>
                        <th className="head">Asset value</th>
                        <th className="head">Phone no</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((data, index) => (
                        <tr key={index}>
                          <td>{data.account}</td>
                          <td>{data.name}</td>
                          <td>{data.gender}</td>
                          <td>{data.address}</td>
                          <td>{data.location}</td>
                          <td>{data.district}</td>
                          <td>{data.plotNo}</td>
                          <td>{data.area}</td>
                          <td>{data.assetValue}</td>
                          <td>{data.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </form>
            <a href="https://example.com">Valid Link</a>
            <button onClick={() => console.log('Button clicked')}>Button</button>
          </section>
        </div>
      </section>
    </div>
  );
};

export default SidebarMenu;