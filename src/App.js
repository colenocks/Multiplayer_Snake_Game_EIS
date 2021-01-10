import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { Route, Switch, withRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Arena from "./components/Arena/Arena";
import EnterGame from "./components/EnterGame/EnterGame";
import { clientRequest, getBaseURL } from "./AxiosConfig";
import { socketIOClient } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_logged_in: false,
      user_session: null,
    };

    this.loginHandler = this.loginHandler.bind(this);
    this.signupHandler = this.signupHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  componentDidMount() {
    const is_logged_in = localStorage.getItem("is_logged_in");
    const user_session = localStorage.getItem("user_session");

    if (is_logged_in || user_session) {
      this.setState({
        is_logged_in,
        user_session,
      });
    }
  }

  loginHandler(event, loginData) {
    event.preventDefault();
    clientRequest()
      .post("/login", loginData)
      .then((res) => {
        toast("Login successful", {
          type: "success",
        });
        localStorage.setItem("is_logged_in", true);
        localStorage.setItem("user_session", res.data.user_session);
        this.setState(
          {
            is_logged_in: true,
            user_session: res.data.user_session,
          },
          () => this.props.history.push("/entergame")
        );
      })
      .catch((err) => {
        console.error("Login Error: " + err);
        this.setState({
          is_logged_in: false,
        });
      });
  }

  signupHandler(event, signupData) {
    event.preventDefault();
    const { email, username, password, confirm_password } = signupData;

    clientRequest()
      .post("/signup", signupData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Signup Error: " + err);
        this.setState({
          is_logged_in: false,
        });
      });
  }

  logoutHandler() {
    this.setState({
      user_session: null,
      is_logged_in: false,
    });
    const socket = socketIOClient(getBaseURL());
    socket.close();
    localStorage.clear();
    this.props.history.push("/");
    toast("You have logged out successfully", { type: "warning" });
  }

  render() {
    return (
      <section className='main__container'>
        <ToastContainer hideProgressBar newestOnTop />
        <Header
          user_session={this.state.user_session}
          logoutHandler={this.logoutHandler}
        />
        <section className='main__content'>
          <Switch>
            <Route
              exact
              path='/'
              render={(props) => (
                <Home
                  loginHandler={this.loginHandler}
                  signupHandler={this.signupHandler}
                />
              )}
            />
            <Route
              exact
              path='/arena'
              render={() => <Arena user_session={this.state.user_session} />}
            />
            <Route
              exact
              path='/entergame'
              render={(props) => (
                <EnterGame {...props} user_session={this.state.user_session} />
              )}
            />
          </Switch>
        </section>
        <Footer />
      </section>
    );
  }
}

export default hot(module)(withRouter(App));
