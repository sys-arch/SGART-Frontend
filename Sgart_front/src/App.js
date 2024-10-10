import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import GoogleAuth from './components/GoogleAuth';

function App() {
  return (
      <div className="App">
          <GoogleAuth />
          <RegisterForm />
      </div>
  );
}

export default App;