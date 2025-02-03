// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './Auth';
import Home from './Home'; // Ensure you import Home
import { AuthProvider } from './AuthContext';


function App() {
    return (

        <Router>

            <AuthProvider>
            
                <Routes>
                    <Route path="/" element={<Auth />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
               
            </AuthProvider>
        </Router>
    );
}

export default App;