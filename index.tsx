import React from "react";
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
import axios from "axios";
import { HashLink } from 'react-router-hash-link';




function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

const Logout = props => {
    const [loggingOut, setLoggingOut] = useState(false)
    useEffect(() => {
        axios.post("http://localhost:3000/logout", { "name": props.currentUser }).then((res) => { props.stlg(res.data.loggedstatus); props.setCurrentUser(""); setLoggingOut(true) })
    }, [])
    return (
        <div>
            {/* this is bad , how can be improved? i want access to the underlying function so I can use it in a setTimeout inside of the above .then , not in a Component */}
            <Redirect to="/" />
        </div>
    )
}

const Login = props => {
    const [result, setResult] = useState("");

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => axios.post("http://localhost:3000/login", data).then((res) => { props.stlg(res.data.loggedstatus); props.setCurrentUser(res.data.currentUser) })

    // console.log("stlg",stlg);

    console.log(watch("example")); // watch input value by passing the name of it

    return (
        <div>
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

function Myaccount(props) {
    const [userData, setUserData] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:3000/account/${props.currentUser}`).then(res => {
            console.log(res);
            setUserData(Object.entries(res.data))
        })
    }, [])

    return (
        <div>
            <h1>my account</h1>
            <ul>
                {userData.map(ele => <li>{ele[0]} --- {ele[1]} </li>)}
            </ul>
        </div>
    )
}

function Transaction(props) {
    const [otherAccounts, setOtherAccounts] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:3000/transactionget/${props.currentUser}`).then(res => {
            console.log(res);
            setOtherAccounts(res.data.accounts)
        });
    }, [])
    return (<div>
        <h1>transaction</h1>
        <ul>
            {otherAccounts.map(account =>
                <li>
                    <ul>
                        {Object.entries(account).map(([a, b]) => <li> <HashLink to={`/preparetransaction/${props.currentUser}/${b}`}> {b} </HashLink> </li>)}
                        <hr />
                    </ul>
                </li>
            )}
        </ul>
    </div>)
}

const PrepareTransaction = (props) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [results , setResults] = useState("");

    console.log("props", props);
    // console.log(match);
    // setResults(res.data)
    const onSubmit = data => axios.post("http://localhost:3000/transaction", {...data, "amount" : Number(data.amount)}).then(res => setResults(res.data))
    // const onSubmit = data => console.log({...data, "amount" : Number(data.amount)});
    
    return (
        <Route
            path="/preparetransaction/:from/:to"
            render={({ match }) => {
                return <div>
                    <h3>preparing transaction</h3>
                    <p> from : {match.params.from} --- to : {match.params.to} </p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* register your input into the hook by invoking the "register" function */}
                        <input defaultValue="0.00" {...register("amount", { required: true })} />
                        <input type="hidden" defaultValue={match.params.from} {...register("from", {required : true})}  />
                        <input type="hidden" defaultValue={match.params.to} {...register("to", {required : true})}  />

                        {/* include validation with required or other standard HTML validation rules */}
                        <input defaultValue="payment note" {...register("note", { required: true })} />
                        {/* errors will return when field validation fails  */}
                        {errors.exampleRequired && <span>This field is required</span>}

                        <input type="submit" />
                    </form>
                    <p>{results}</p>
                </div>;
            }}
        />
    );
}

function App() {

    const [loggedIn, setLoggedIn] = useState<Boolean>(false) // myTODO change bool to false and currentUser to "" , just using these for now to get around auth
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
                        {loggedIn ?
                            (
                                <>
                                    <li>
                                        <Link to="/myaccount"> My account </Link>
                                    </li>
                                    <li>
                                        <Link to="/transaction">Transaction</Link>
                                    </li>
                                </>

                            ) : ""}

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
                    <Route path="/myaccount">
                        <Myaccount currentUser={currentUser} />
                    </Route>
                    <Route path="/transaction">
                        <Transaction currentUser={currentUser} />
                    </Route>

                    <Route path="/preparetransaction/:from/:to">
                        <PrepareTransaction />
                    </Route>

                    {/* note, leave / at bottom, itll hit on all cases */}
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