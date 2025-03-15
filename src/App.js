import React, { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import './styles.css';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Invoicing App</h1>
        <button className="create-invoice-btn" onClick={openModal}>
          Create Invoice
        </button>
      </header>
      <main className="app-container">
        <section className="invoice-list-section">
          <InvoiceList />
        </section>
      </main>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>
              ×
            </button>
            <InvoiceForm closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;