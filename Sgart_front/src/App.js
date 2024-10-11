import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import GoogleAuth from './components/GoogleAuth';
import UserValidationUI from './components/UserValidationUI';

function App() {
  return (
      <div className="App">
        <UserValidationUI />
      </div>
  );
}

export default App;