import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';  
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


 const particleStyles = {
                particles: {
                  number: {
                    value: 80,
                    density: {
                      enable: true,
                      value_area: 800
                    }
                  }
                }
              }   
const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'SignIn',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}              

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }


loadUser = (data) => {
  this.setState({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined

  }})
}
  

  calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputimage');
     const width = Number(image.width);
     const height = Number(image.height);
     console.log(width, height);
     return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      buttonRow: height - (clarifaiFace.bottom_row * height)
     }
   }

   displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});

   }

     
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
   
 
onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
   fetch('http://localhost:3000/imageUrl',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
       input: this.state.input
    })
   })
   .then(response => response.json( ))  
  .then(response => {
   if(response) {
    fetch('http://localhost:3000/image',{
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
       id: this.state.user.id
    })
   }) 
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user, {entries: count}))
    })
  }
 this.displayFaceBox(this.calculateFaceLocation(response))
})
  .catch(err => console.log(err));
} 

onRouteChange = (route) => {
  if (route === 'signout'){
    this.setState(initialState)
  } else if (route === 'home') {
  this.setState({isSignedIn : true});
}
this.setState({route: route});
}


  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
      <Particles className='particles'
              params={particleStyles}
        />
    
       <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
       {route === 'home' 
       ?  <div> 
           <Logo /> 
             <Rank name={this.state.user.name} entries={this.state.user.entries}/>
           <ImageLinkForm  
             onInputChange={this.onInputChange}
             onButtonSubmit={this.onButtonSubmit}
             /> 
           <FaceRecognition box={box} imageUrl={imageUrl} /> 
           </div>
        : (
            this.state.route === 'SignIn'
           ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>   
          )
  }
    </div>
  );
}
}
export default App;

 // a403429f2ddf4b49b307e318f00e528b

 //  onButtonSubmit = () => {
 // this.setState({imageUrl: this.state.input});
 //    app.models
 //    .predict(
 //      Clarifai.COLOR_MODEL,
 //      "https://samples.claifai.com/face-det.jpeg")
 //    .then(
 //      function(responce) {
 //       console.log(responce);
 //      },
 //      function(err) {
 //      }
 //    );
 //  } 