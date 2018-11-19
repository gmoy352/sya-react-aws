import React, { Component } from 'react';
import { Auth } from 'aws-amplify';

import {API} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { Storage } from 'aws-amplify';
import {axios} from 'axios';
import {uuid} from 'uuid';
import { runInThisContext } from 'vm';


class UploadImage extends Component {

    constructor() {
        const uuidv4 = require('uuid/v4');
        super();

        this.state = {
            file: null,
            name: '',
            image_key: uuidv4(),
            descript: '',
            user_name: '',
            date: '',
            sub: '',
            token: ''
        }

        Auth.currentAuthenticatedUser()
        .then(user => {
                this.setState({user_name: user.username});
                this.setState({sub: user.attributes.sub});
                this.setState({token: user.signInUserSession.idToken.jwtToken});
                console.log(user.signInUserSession.idToken.jwtToken);
            }
        )

        console.log(Auth.currentAuthenticatedUser());

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleChangeDes= this.handleChangeDes.bind(this)
    }

    handleChange = (event) => {
        if ( event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({image: e.target.result});
            };
            reader.readAsDataURL(event.target.files[0]);
        }
        this.setState({file: event.target.files[0]})
    }

    handleChangeName = (event) => {
        this.setState({name: event.target.value});
    }

    handleChangeDes = (event) => {
        this.setState({descript: event.target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.file == null) {
            alert("File Not Chosen")
        }
        else {   

            const users = {
                art_title:   this.state.name,
                sub:         this.state.sub,
                artist_name: this.state.user_name,
                descript:    this.state.descript,
                upload_date: new Date(),
                image_key:   this.state.image_key 
            }

            fetch('https://ckz78jlmb1.execute-api.us-east-1.amazonaws.com/prod/upload-image',{
                method: 'POST',
                body: users,
                headers: {
                    'Authorization' : this.state.token,
                }
            })
            .then (result => console.log(result))
            .catch(err => console.log(err));

            /*
            Storage.put(this.state.name, file, {
                contentType: 'image',
                bucket:'myapp-20181030214040-deployment'
            })
            .then (result => console.log(result))
            .catch(err => console.log(err));
            */
        }
    }

    render() {
        return(
            <div>
            <form onSubmit = {this.handleSubmit}>
                Name:
                <p><input type = "text" value={this.state.name}
                onChange = {this.handleChangeName}/></p>
                Description:
                <p><input type = "text" value={this.state.descript}
                onChange = {this.handleChangeDes}/></p>
                <input label = 'upload image' 
                type = 'file' onChange = {this.handleChange} 
                accept = "image/*"/>
                <img src ={this.state.image} alt ="No Art Selected" height = "200" />
                <p><button type = 'submit' >
                    Upload
                </button></p>
            </form>
            
            </div>
        )
    }

}
export default withAuthenticator(UploadImage);