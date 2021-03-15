import React, {useEffect} from "react";
import Subscription from "./app/pages/Subscription/Subscription";
import {useSelector} from "react-redux";
import {selectLoading} from "./app/globalSlice";
import CircleLoader from "react-spinners/CircleLoader";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Account from "./app/pages/Account/Account";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import PlanPagos from "./app/pages/PlanPago/PlanPago";


function App() {
    const load = useSelector(selectLoading);

    return (
        <Router>
            <div className="App">
                <div className="container">
                    <div className="form-subscripcion">

                        {load && (
                            <div id="overlay">
                                <div className="loader">
                                    <CircleLoader
                                        size={100}
                                        loading={load}
                                        color={"#548FD3"}
                                    />
                                </div>
                            </div>
                        )}


                        <Switch>
                            <Route exact path="/">
                                <Subscription/>
                            </Route>
                            <Route exact path="/account">
                                <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_CAPTCHA_3}>
                                    <Account/>
                                </GoogleReCaptchaProvider>

                            </Route>
                            <Route exact path="/planpagos/:planId">
                                <PlanPagos/>
                            </Route>
                            <Route exact path="/planpagosmobile/:planId">
                                <PlanPagos isMobile/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
            <div/>

        </Router>
    );
}

export default App;
