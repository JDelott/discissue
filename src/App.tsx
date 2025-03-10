import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import IssueGenerator from './components/IssueGenerator';
import TestConnection from './components/TestConnection';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<IssueGenerator />} />
          <Route path="/test" element={<TestConnection />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
