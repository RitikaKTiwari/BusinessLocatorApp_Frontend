import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import BusinessMain from "./BusinessMain";

const BusinessHome = () => {
    return (
        <div>
            <header>
                <Header />
            </header>
            <body>
                <div>
                    <BusinessMain />
                </div>
                <footer>
                    <Footer />
                </footer>
            </body>
        </div>
    );
};

export default BusinessHome;