import React from 'react';
import './Settings.css';
import account from '../../../../image/account.png';
import contact from '../../../../image/customer-service.png';
import setting from '../../../../image/setting.mp4';
import { useNavigate } from 'react-router-dom';
import Header from '../../../Header/Header';
import Footer from '../../../Footer/Footer';
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Settings = () => {
    const navigate = useNavigate();
    function settclick() {
        navigate('/BusinessAccountSettings');
    }

    function viewclick() {
        navigate('/BusinessPrivacyAndSecurity');
    }

    // function bookClick() { 
    //     navigate('/ViewMyAppointment');
    // }

    function contactClick(){
        navigate('/ContactUs');
    }


    return (
        <div>
            <header><Header></Header></header>
            <title>Your Account</title>
            <body>
                <div className="set-container">
                    <h1 className='set-h1'>Your Account</h1>
                    <div style={{marginLeft:100}}>
            <IconButton
              onClick={() => {
                navigate(-1);

              }}
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
          </div>
                    <div className="set-account-grid">
                        <div className="set-account-item" onClick={settclick}>
                            <video width={70} height={70} src={setting} alt="Setting" />
                            <h2>Account Settings</h2>
                            <p>Add account, Delete account, Logout</p>
                        </div>
                        <div className="set-account-item" onClick={viewclick}>
                            <video width={70} height={70} src={account} alt="Login & security" />
                            <h2>Privacy & security</h2>
                            <p>Manage your address & password</p>
                        </div>
                        {/* <div className="set-account-item" onClick={bookClick}>
                            <img width={70} height={70} src={booked} alt="Booked Services" />
                            <h2>View my Appointments</h2>
                            <p>View your previously booked services</p>
                        </div> */}
                        <div className="set-account-item" onClick={contactClick}>
                            <img width={70} height={70} src={contact} alt="Contact Us" />
                            <h2>Contact Us</h2>
                            <p>Get help with your orders and more</p>
                        </div>
                    </div>
                </div>
            </body>
            <footer><Footer></Footer></footer>
        </div>
    )
}

export default Settings;