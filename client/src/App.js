import React from 'react';
import './App.css';
import config from './config/config';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            id: '',
            user: {
                first_name: '',
                email: '',
                password: '',
            },
            registerUser: {
                first_name: '',
                email: '',
                password: '',
                favourite_fruit: 'Apple',
            },
        };

        this.post = this.post.bind(this);
        this.get = this.get.bind(this);
        this.getUser = this.getUser.bind(this);
        this.handleIdChange = this.handleIdChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createUser = this.createUser.bind(this);
        this.resetForm = this.resetForm.bind(this);

        // Ref callback
        this.setFormRef = element => {
            this.mainFormRef = element;
        }
    }

    resetForm() {
        if (this.mainFormRef) {
            this.mainFormRef.reset();
        }

        this.setState({
            first_name: '',
            email: '',
            password: '',
            favourite_fruit: 'Apple',
        });
    }

    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data),
        });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }

        this.resetForm();

        return body;
    }

    async get(url) {
        const response = await fetch(url);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }

        return body;
    };

    async getUser() {
        if(this.state.id.length) {
            const response = await this.get(`${config.SERVER_URL}/api/get-user/${this.state.id}`);
            this.setState({user: response.user});
        }
    }

    handleIdChange(event) {
        this.setState({id: event.target.value});
    }

    handleInputChange(event) {
        const name = event.target.name;
        const registerUser = {
            ...this.state.registerUser,
        };
        registerUser[name] = event.target.value;

        this.setState({registerUser});
    }

    createUser(event) {
        event.preventDefault();
        this.post(`${config.SERVER_URL}/api/users/`, this.state.registerUser);
    }

    render() {
        return (
            <div className="app">
                <header className="app-header">
                    <h1 className="app-title">Welcome to Coding-Test</h1>
                </header>
                <div>
                    <p className="app-intro">
                        Name: {this.state.user.first_name}
                    </p>
                    <p className="app-intro">
                        Email: {this.state.user.email}
                    </p>
                    <input value={this.state.id} onChange={this.handleIdChange}/>
                    <button
                        onClick={this.getUser}
                    >
                        Get User
                    </button>
                </div>
                <hr />
                <section className="main-form-container">
                    <form className="main-form" onSubmit={this.createUser} ref={this.setFormRef}>
                        <div className="main-form-group">
                            <label htmlFor="first-name">First Name</label>
                            <input required type="text" id="first-name" name="first_name" onChange={this.handleInputChange}/>
                        </div>
                        <div className="main-form-group">
                            <label htmlFor="email-address">Email</label>
                            <input required type="email" id="email-address" name="email" onChange={this.handleInputChange}/>
                        </div>
                        <div className="main-form-group">
                            <label htmlFor="password">Password</label>
                            <input required type="password" id="password" name="password" onChange={this.handleInputChange}/>
                        </div>
                        <div className="main-form-group">
                            <label htmlFor="favourite-fruit">Favourite Fruit</label>
                            <select required id="favourite-fruit" name="favourite_fruit" onChange={this.handleInputChange} defaultValue={this.state.registerUser.favourite_fruit}>
                                <option value="Apple">🍏 Apple</option>
                                <option value="Mango">🥭 Mango</option>
                                <option value="Banana">🍌 Banana</option>
                                <option value="Apricot">🍊 Apricot</option>
                            </select>
                        </div>
                        <button type="submit">Create User</button>
                    </form>
                </section>
            </div>
        );
    }
}

export default App;
