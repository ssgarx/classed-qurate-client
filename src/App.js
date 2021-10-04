import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import { NotifierProvider } from "./context/notifier";
import { GroupSelectorProvider } from "./context/groupSelector";
import { AuthRoute, AuthRoute2 } from "./util/AuthRoute"; //2 IF REGISTERED THEN DESIRED LOC ELSE HOME

import Home from "./pages/Home";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import { GroupUpdaterProvider } from "./context/groupsUpdater";
import ExploreResized from "./pages/ExploreResized";

function App() {
  return (
    <AuthProvider>
      <NotifierProvider>
        <GroupUpdaterProvider>
          <GroupSelectorProvider>
            <Router>
              <Route exact path="/" component={Home} />
              <AuthRoute
                exact
                path="/otpverification"
                component={OtpVerification}
              />
              <AuthRoute exact path="/register" component={Register} />
              <AuthRoute2 exact path="/groups" component={Groups} />
              <AuthRoute2 exact path="/groups/:groupId" component={Group} />
              <AuthRoute2 exact path="/explore" component={ExploreResized} />
            </Router>
          </GroupSelectorProvider>
        </GroupUpdaterProvider>
      </NotifierProvider>
    </AuthProvider>
  );
}

export default App;
