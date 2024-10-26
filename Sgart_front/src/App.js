import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import GoogleAuth from './components/GoogleAuth';
import AdminWorkingHours from './components/AdminWorkingHours';
import GoogleAuthLogin from './components/GoogleAuthLogin';

function App() {
  return (
      <div className="App">
          <AdminWorkingHours />
      </div>
  );
}

export default App;