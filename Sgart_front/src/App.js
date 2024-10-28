import './App.css';
import AdminAusenciasUI from './components/AdminAusenciasUI';
import UserValidationUI from './components/UserValidationUI';
//import LoginForm from './components/LoginForm';
import AdminWorkingHours from './components/AdminWorkingHours';
import LoginForm from './components/LoginForm';

function App() {
  return (
      <div className="App">
        <UserValidationUI />
      </div>
  );
}

export default App;