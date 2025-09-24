import React from 'react';

const Invoices: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage invoices and billing</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-400">Invoice management functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default Invoices;
