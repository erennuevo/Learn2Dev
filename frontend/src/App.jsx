import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import MyListings from "./pages/MyListings.jsx";
import Profile from "./pages/Profile.jsx";
import PublicProfile from "./pages/PublicProfile.jsx";
import ChatList from "./pages/ChatList.jsx";
import ChatDetail from "./pages/ChatDetail.jsx";
import MapPage from "./pages/MapPage.jsx";
import CreateMeetup from "./pages/CreateMeetup.jsx";
import MeetupDetail from "./pages/MeetupDetail.jsx";
import MyMeetups from "./pages/MyMeetups.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Marketplace />} />
                    <Route path="listing/:id" element={<ListingDetail />} />
                    <Route path="create-listing" element={<CreateListing />} />
                    <Route path="edit-listing/:id" element={<CreateListing />} />
                    <Route path="my-listings" element={<MyListings />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/:username" element={<PublicProfile />} />
                    <Route path="chats" element={<ChatList />} />
                    <Route path="chats/:id" element={<ChatDetail />} />
                    <Route path="map" element={<MapPage />} />
                    <Route path="meetups/:id" element={<MeetupDetail />} />
                    <Route path="create-meetup" element={<CreateMeetup />} />
                    <Route path="my-meetups" element={<MyMeetups />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;