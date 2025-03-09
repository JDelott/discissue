import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import IssueGenerator from './components/IssueGenerator';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/generate" element={<Layout><IssueGenerator /></Layout>} />
    </Routes>
  );
}

export default App;
