import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import GoogleAuth from './components/GoogleAuth';
import UserValidationUI from './components/UserValidationUI';
import AdminWorkingHours from './components/AdminWorkingHours';

function App() {
  return (
      <div className="App">
        <UserValidationUI />
          <LoginForm />
      </div>
  );
}

export default App;