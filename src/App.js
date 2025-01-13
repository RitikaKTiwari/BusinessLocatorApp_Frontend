import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminMain from "../src/components/Admin/AdminMain";
import Home from '../src/components/User/Home/Home';
import BusinessRegistration from '../src/components/Sign_Auth/Registration/BusinessRegistration';
import UserRegistration from '../src/components/Sign_Auth/Registration/UserRegistration';
import Login from '../src/components/Sign_Auth/Login/Login';
import InsertCategory from './components/User/Category/InsertCategory';
import ViewCategory from '../src/components/User/Category/ViewCategory';
import InsertSubCategory from './components/User/SubCategory/InsertSubCategory';
import ViewSubCategory from './components/User/SubCategory/ViewSubCategory';
import ViewService from './components/User/Service/ViewService';
import InsertService from './components/User/Service/InsertService';
import CategoryMenu from '../src/components/User/Category/CategoryMenu/CategoryMenu';
import Dashboard from '../src/components/Admin/Dashboard';
import UserManagement from './components/Admin/UserManagement/UserManagement';
import CategoryManagement from './components/Admin/CategoryManagement/CategoryManagement';
import ViewBusinessProfile from './components/User/ProfileManagement/BusinessProfileManagement/ViewBusinessProfile';
import ViewMyServices from './components/User/ProfileManagement/BusinessProfileManagement/ViewMyServices';
import Settings from './components/User/ProfileManagement/BusinessProfileManagement/BusinessSettings/Settings';
import Logout from './components/User/ProfileManagement/Logout';
import ViewBusinessService from './components/User/BusinessService/ViewBusinessService';
import BookAppointment from './components/User/Appointment/BookAppointment';
import ApproveAppointment from "./components/User/Appointment/ApproveAppointment";
import InsertBusinessService from "./components/User/BusinessService/InsertBusinessService";
import BusinessDashboard from './components/User/BusinessDashboard/BusinessDashboard';
import ViewProfile from './components/User/ProfileManagement/UserProfileManagement/ViewProfile';
import UpdateProfile from './components/User/ProfileManagement/UserProfileManagement/UpdateProfile';
import UpdateBusinessProfile from './components/User/ProfileManagement/BusinessProfileManagement/UpdateBusinessProfile';
import ForgotPassword from './components/User/ForgotPassword/ForgotPassword';
import ChangePassword from './components/User/ProfileManagement/BusinessProfileManagement/ChangePassword';
import ViewTechnician from './components/User/Technician/ViewTechnician';
import InsertTechnician from './components/User/Technician/InsertTechnician';
import Favourites from './components/User/Favourites/Favourites';
import ContactUs from './components/User/ContactUs/ContactUs';
import PrivacyPolicy from './components/User/PrivacyPolicy/PrivacyPolicy';
import AboutUs from './components/User/AboutUs/AboutUs';
import BusinessMain from './components/User/BusinessDashboard/BusinessMain';
import UpdateTechnician from './components/User/Technician/UpdateTechnician';
import UpdateBusinessService from './components/User/BusinessService/UpdateBusinessService';
import BusinessPie from './components/User/BusinessDashboard/BusinessPie';
import ViewBusinessServiceDetail from './components/User/Home/ViewBusinessServiceDetail';
import ViewFromMenu from './components/User/Home/ViewFromMenu';
import AccountSettings from './components/User/ProfileManagement/UserProfileManagement/UserSettings/AccountSettings';
import UserSettings from './components/User/ProfileManagement/UserProfileManagement/UserSettings/UserSettings';
import PrivacySecurity from './components/User/ProfileManagement/UserProfileManagement/UserSettings/PrivacySecurity';
import ViewAndUpdateAddress from './components/User/ProfileManagement/UserProfileManagement/UserSettings/ViewAndUpdateAddress';
import ViewMyAppointment from './components/User/Appointment/ViewMyAppointment';
import UserChangePassword from './components/User/ProfileManagement/UserProfileManagement/UserSettings/UserChangePassword';
import BusinessAccountSettings from './components/User/ProfileManagement/BusinessProfileManagement/BusinessSettings/BusinessAccountSettings';
import BusinessPrivacyAndSecurity from './components/User/ProfileManagement/BusinessProfileManagement/BusinessSettings/BusinessPrivacyAndSecurity';
import ViewAndUpdateBusinessAddress from './components/User/ProfileManagement/BusinessProfileManagement/BusinessSettings/ViewAndUpdateBusinessAddress';
import GoogleLoginComponent from './components/Sign_Auth/Login/GoogleLoginComponent';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/'
            element={<Home />}>
          </Route>

          <Route path='/AccountSettings'
            element={<AccountSettings />}
          ></Route>
          <Route path='/GoogleLoginComponent'
            element={<GoogleLoginComponent />}
          ></Route>


          <Route path='/UserSettings'
            element={<UserSettings />}
          ></Route>

          <Route path='/PrivacyAndSecurity'
            element={<PrivacySecurity />}
          ></Route>

          <Route path='/ViewAndUpdateAddress'
            element={<ViewAndUpdateAddress />}
          ></Route>

          <Route path='/ContactUs'
            element={<ContactUs />}
          ></Route>

          <Route path='/ViewMyAppointment'
            element={<ViewMyAppointment />}
          ></Route>

          <Route
            path="/ViewMyAppointment"
            element={<ViewMyAppointment />}
          ></Route>

          <Route
            path="/ViewFromMenu/:serviceId"
            element={<ViewFromMenu />}
          ></Route>

          <Route path='/UpdateProfile'
            element={<UpdateProfile />}>
          </Route>

          <Route path='/ViewBusinessServiceDetail/:businessserviceid'
            element={<ViewBusinessServiceDetail />}>
          </Route>

          <Route path='/BusinessRegistration'
            element={<BusinessRegistration />}>
          </Route>

          <Route path='/Login'
            element={<Login />}>
          </Route>

          <Route path='/UserRegistration'
            element={<UserRegistration />}>
          </Route>

          <Route path='/InsertCategory'
            element={<InsertCategory />}>
          </Route>

          <Route path='/ViewCategory'
            element={<ViewCategory />}>
          </Route>

          <Route path='/InsertSubCategory'
            element={<InsertSubCategory />}>
          </Route>

          <Route path='/ViewSubCategory'
            element={<ViewSubCategory />}>
          </Route>

          <Route path='/InsertService'
            element={<InsertService />}>
          </Route>

          <Route path='/ViewService'
            element={<ViewService />}>
          </Route>

          <Route path='/InsertBusinessService'
            element={<InsertBusinessService />}>
          </Route>

          <Route path='/CategoryMenu'
            element={<CategoryMenu />}>
          </Route>

          <Route path='/ViewBusinessProfile'
            element={<ViewBusinessProfile />}>
          </Route>

          <Route path='/ViewProfile'
            element={<ViewProfile />}>
          </Route>

          <Route path='/UpdateProfile'
            element={<UpdateProfile />}>
          </Route>

          <Route path="/ViewBusinessService/:businessId"
            element={<ViewBusinessService />} >
          </Route>

          <Route path='/ViewMyServices'
            element={<ViewMyServices />}>
          </Route>

          <Route path='/ViewTechnician'
            element={<ViewTechnician />}>
          </Route>

          <Route path='/InsertTechnician'
            element={<InsertTechnician />}>
          </Route>

          <Route path="/BookAppointment/:businessServiceId"
            element={<BookAppointment />} >
          </Route>

          <Route path="/ApproveAppointment"
            element={<ApproveAppointment />} >
          </Route>

          <Route path='/Settings'
            element={<Settings />}>
          </Route>

          <Route path='/Logout'
            element={<Logout />}>
          </Route>

          <Route path='/ForgotPassword'
            element={<ForgotPassword />}>
          </Route>

          <Route path='/ChangePassword'
            element={<ChangePassword />}>
          </Route>

          <Route path='/UserChangePassword'
            element={<UserChangePassword />}>
          </Route>

          <Route path='/Dashboard'
            element={<Dashboard />}>
          </Route>

          <Route path='/AdminMain'
            element={<AdminMain />}>
          </Route>

          <Route path='/UserManagement'
            element={<UserManagement />}>
          </Route>

          <Route path='/CategoryManagement'
            element={<CategoryManagement />}>
          </Route>

          <Route path='/BusinessDashboard'
            element={<BusinessDashboard />}
          ></Route>

          <Route path='/UpdateBusinessProfile'
            element={<UpdateBusinessProfile />}
          ></Route>

          <Route path='/Favourites'
            element={<Favourites />}>
          </Route>

          <Route path='/ContactUs'
            element={<ContactUs />}>
          </Route>

          <Route path='/PrivacyPolicy'
            element={<PrivacyPolicy />}>
          </Route>

          <Route path='/AboutUs'
            element={<AboutUs />}>
          </Route>

          <Route path='/BusinessMain'
            element={<BusinessMain />}
          ></Route>

          <Route path="/UpdateTechnician/:technicianId"
            element={<UpdateTechnician />} >
          </Route>

          <Route path="/UpdateBusinessService/:businessServiceId"
            element={<UpdateBusinessService />} >
          </Route>

          <Route path="/BusinessPie"
            element={<BusinessPie />} >
          </Route>

          <Route path='/BusinessPrivacyAndSecurity'
            element={<BusinessPrivacyAndSecurity />}
          ></Route>

          <Route path='/ViewAndUpdateBusinessAddress'
            element={<ViewAndUpdateBusinessAddress />}
          ></Route>


          <Route path='/BusinessAccountSettings'
            element={<BusinessAccountSettings />}
          ></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


/*

All registrations,search
Update address, Change Password, Forgot Password for business

sign-in with google
*/