export const staticInvoices = [
    {
      id: 1,
      items: [
        { description: "Web Design", type: "labor", rate: 50, quantity: 4 },
        { description: "Travel", type: "expense", rate: 30, quantity: 1 },
      ],
      notes: "Please send check to 123 Infinite St., Tech City",
      status: "outstanding",
      dueDate: "2025-03-20",
      createdAt: "2025-03-14",
    },
    {
      id: 2,
      items: [{ description: "Consulting", type: "labor", rate: 60, quantity: 2 }],
      notes: "Pay via bank transfer to account #987654",
      status: "paid",
      dueDate: "2025-03-10",
      createdAt: "2025-03-01",
    },
    {
      id: 3,
      items: [
        { description: "Development", type: "labor", rate: 70, quantity: 3 },
        { description: "Materials", type: "material", rate: 25, quantity: 1 },
      ],
      notes: "Payment due within 15 days",
      status: "late",
      dueDate: "2025-03-12",
      createdAt: "2025-03-05",
    },
  ];