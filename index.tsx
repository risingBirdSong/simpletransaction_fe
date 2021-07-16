import React from "react"
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";




function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

function Home() {
    const [loggedInName, setLoggedInName] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/account/hermione")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    const person = result.user[0].name
                    setLoggedInName(person);
                    // setItems(result);
                },

                (error) => {
                    console.log(error)
                }
            )
    }, [])

    return (
        <div>
            <h1>im home :)</h1>
            <div>
                <p>logged in name :</p>
                <p> {loggedInName} </p>
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


function Form () {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);
  
    console.log(watch("example")); // watch input value by passing the name of it
  
    return (
      /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input defaultValue="test" {...register("example")} />
        
        {/* include validation with required or other standard HTML validation rules */}
        <input {...register("exampleRequired", { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.exampleRequired && <span>This field is required</span>}
        
        <input type="submit" />
      </form>
    );
}

function App() {
    return (
        <Router>
            <div>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/news">
                    <NewsFeed />
                </Route>
                <Route path="/form">
                    <Form />
                </Route>
            </div>
        </Router>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);