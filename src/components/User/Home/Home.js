import React from "react";
import Header from "../Header/Header";
import CategoryMenu from "../Category/CategoryMenu/CategoryMenu";
import MapLayout from "../MapLayout/MapLayout";
import Footer from "../Footer/Footer";
import Card2 from '../../Reusable/Cards/Card2'
import ViewServices from './ViewServices'

const Home = () => {
    return (
        <div>
            <header>
                <Header />
            </header>
            <body>
                <div>
                    <CategoryMenu />
                </div>
                <div>
                    <MapLayout />
                </div>
                <div>
                    <Card2/>
                </div>
                <div>
                    <ViewServices/>
                </div>
                <footer>
                    <Footer />
                </footer>
            </body>
        </div>
    );
};

export default Home;
