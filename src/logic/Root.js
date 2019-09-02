import React, { useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
// import UserContext from "../context/UserContext";
//import { AdminContext } from "../context/allContexts";
import firebase, { db } from "../logic/firebase";
import { withRouter } from "react-router-dom";
import { UserContext } from "../context/allContexts";

//import Dashboard from '../Dashboard/Dashboard';
import StudentDashBoard from "../components/students/StudentDashBoard/StudentDashBoard.js";
// import StudentBuildWeekLink from "../components/students/StudentBuildWeekLink/StudentBuildWeekLink.js";
import Login from "../components/Auth/Login";
// import StudentLogin from "../components/Auth/StudentLogin";
import StudentRegister from "../components/Auth/StudentRegister.js";
//import Register from '../components/Auth/Register';
import AddMinion from "../components/admin/AdminDashboard/AddMinion.js";
import OverLoardMainDashboard from "../components/admin/AdminDashboard/OverloardMainDashBoard.js";
import AdminDashboard from "../components/admin/AdminDashboard/AdminDashboard.js";

const Root = ({ history }) => {
  const {
    user,
    setUser,
    role,
    setRole,
    email,
    setEmail,
    password,
    setPassword
  } = useContext(UserContext);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log("user: ", user);
      if (user) {
        console.log("CHECK IF ADMIN");
        checkIfAdmin(user.email);
        const { displayName, uid } = user;
        setUser({ displayName, uid });
      } else {
        history.push("/");
      }
    });
  }, []);

  // CHECK IF USER IS ADMIN
  // const checkIfAdmin = async userEmail => {
  //   let adminEmails = [];
  //   await db
  //     .collection("admin")
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.forEach(doc => {
  //         adminEmails.push(doc.data().email);
  //       });
  //       let isAdmin = false;
  //       adminEmails.forEach(theAdmin => {
  //         if (theAdmin === userEmail) {
  //           console.log("SET ROLE MINION");
  //           setEmail(theAdmin);
  //           setRole("minion");
  //           return;
  //         }
  //       });
  //     });
  // };
  // TESTING
  const checkIfAdmin = async userEmail => {
    console.log("USER EMAIL: ", userEmail);
    let adminList = [];
    await db
      .collection("admin")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          adminList.push({ email: doc.data().email, role: doc.data().role });
        });
        let isAdmin = false;
        adminList.forEach(admin => {
          console.log(admin);
          if (admin.email === userEmail) {
            console.log("SET ROLE MINION");
            setEmail(admin.email);
            setRole(admin.role);
            return;
          }
        });
        if (!isAdmin) {
          setEmail(userEmail);
          setRole("student");
        }
      });
  };

  return (
    <>
      <UserContext.Provider
        value={{
          user,
          setUser,
          setRole,
          role,
          email,
          setEmail,
          password,
          setPassword
        }}
      >
        <Switch>
          <Route exact path="/" component={Login} />
          {role === "minion" || role === "overlord" ? (
            <>
              <Route
                exact
                path="/overlord"
                component={OverLoardMainDashboard}
              />
              <Route exact path="/admin/addMinion" component={AddMinion} />
              <Route
                exact
                path="/admin/:BuildWeek"
                component={AdminDashboard}
              />
            </>
          ) : null}
          {role === "student" ? (
            <>
              <Route path="/student/dashboard" component={StudentDashBoard} />
              <Route path="/student/Register" component={StudentRegister} />
            </>
          ) : null}

          {/* <Route path="/student/StudentLogin" component={StudentLogin} /> */}
          {/* <Route path="/student/:buildWeek" component={StudentBuildWeekLink} /> */}
        </Switch>
      </UserContext.Provider>
    </>
  );
};

export default withRouter(Root);
