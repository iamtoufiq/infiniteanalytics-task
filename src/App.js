import React from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import './styles.css';

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Invoicing App</h1>
      </header>
      <main className="app-container">
        <section className="invoice-form-section">
          <InvoiceForm />
        </section>
        <section className="invoice-list-section">
          <InvoiceList />
        </section>
      </main>
    </div>
  );
};

export default App;