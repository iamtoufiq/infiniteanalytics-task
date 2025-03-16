import React, { useState } from "react";
import AppHeader from "./components/AppHeader";
import InvoiceList from "./components/InvoiceList";
import Modal from "./components/Modal";
import InvoiceForm from "./components/InvoiceForm";
import "./styles.css";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app">
      <Toaster />
      <AppHeader onCreateInvoice={openModal} />
      <main className="app-container">
        <section className="invoice-list-section">
          <InvoiceList />
        </section>
      </main>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <InvoiceForm closeModal={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default App;
