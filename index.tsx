import React from "react"
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
} from "react-router-dom";
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios"



function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

// function Home() {
//     const [loggedInName, setLoggedInName] = useState("");


//     return (
//         <div>
//             <h1>im home :)</h1>

//         </div>
//     )
// }

const Logout = props => {
    useEffect(() => {
        axios.post("http://localhost:3000/logout", {"name" : props.currentUser} ).then((res) => {props.stlg(res.data.loggedstatus); props.setCurrentUser(""); setLoggingOut(true)})
    }, [])
    return (
        <div>
            <Redirect to="/" />
        </div>
    )
}

const Login = props => {
    const [result, setResult] = useState("");

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => axios.post("http://localhost:3000/login", data).then((res) => { props.stlg(res.data.loggedstatus) ; props.setCurrentUser(res.data.currentUser) })

    // console.log("stlg",stlg);

    console.log(watch("example")); // watch input value by passing the name of it

    return (
        <div>
            <p>lets log in</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* register your input into the hook by invoking the "register" function */}
                <input defaultValue="enter your name" {...register("name", { required: true })} />

                {/* include validation with required or other standard HTML validation rules */}
                <input type="password" defaultValue="enter your password" {...register("password", { required: true })} />
                {/* errors will return when field validation fails  */}
                {errors.exampleRequired && <span>This field is required</span>}

                <input type="submit" />
            </form>
        </div>
    );
}



const Signup = () => {
    const [result, setResult] = useState("");
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [error, setError] = useState("")

    const onSubmit = data => axios.post("http://localhost:3000/simpleaccount", data).then((res) => { setResult(res); setTimeout(() => { setResult(false) }, 2000) }).catch(err => {
        setError(err.message); console.log(err);
    });

    // const onSubmit = data => console.log(data.loginName)

    const turnOffError = () => {
        setError(false)
    }

    return (
        <div>
            <button onClick={turnOffError} >clear error</button>
            <h1>signing up</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* register your input into the hook by invoking the "register" function */}
                <input defaultValue="your login name" {...register("name", { required: true })} />

                {/* include validation with required or other standard HTML validation rules */}
                <input type="password" defaultValue="your password" {...register("password", { required: true })} />
                {/* errors will return when field validation fails  */}
                {errors.exampleRequired && <span>This field is required</span>}

                <input type="submit" />
            </form>
            <div>
                {
                    result ?
                        (
                            <div>
                                results
                                <p>{result.data}</p>
                                <p>{result.status}</p>
                            </div>
                        ) : error ?
                            (<div>
                                error :
                                {error}
                            </div>)
                            : ""}
            </div>
        </div>
    )

}

function NewsFeed() {
    return (
        <div>
            <h1>im newsfeed</h1>
        </div>
    )
}


function Form() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    console.log(watch("example")); // watch input value by passing the name of it

    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <input defaultValue="test" {...register("example")} />

            {/* include validation with required or other standard HTML validation rules */}
            <input defaultValue="hi there" {...register("exampleRequired", { required: true })} />
            {/* errors will return when field validation fails  */}
            {errors.exampleRequired && <span>This field is required</span>}

            <input type="submit" />
        </form>
    );
}


function App() {

    const [loggedIn, setLoggedIn] = useState<Boolean>(false)
    const [currentUser, setCurrentUser] = useState("");
    console.log("setLoggedIn", setLoggedIn);

    return (
        <Router>
            <div>
                <p>{currentUser}</p>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/signup">Signup</Link>
                        </li>
                        <li>
                            {loggedIn ? <Link to="/logout">Log Out</Link> : <Link to="/login">Log In</Link>}
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/signup">
                        <Signup />
                    </Route>
                    <Route path="/login">
                        <Login stlg={setLoggedIn} setCurrentUser={setCurrentUser} />
                    </Route>
                    <Route path="/logout">
                        <Logout stlg={setLoggedIn} currentUser={currentUser} setCurrentUser={setCurrentUser} />
                    </Route>
                    <Route path="/">
                        <h1>we home</h1>
                    </Route>
                </Switch>
            </div>
        </Router>

    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);


    // useEffect(() => {
    //     fetch("http://localhost:3000/account/hermione")
    //         .then(res => res.json())
    //         .then(
    //             (result) => {
    //                 console.log(result)
    //                 const person = result.user[0].name
    //                 setLoggedInName(person);
    //                 // setItems(result);
    //             },

    //             (error) => {
    //                 console.log(error)
    //             }
    //         )
    // }, [])