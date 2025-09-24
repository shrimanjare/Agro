import React from 'react';

const ViewInvoice: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">View Invoice</h1>
        <p className="text-gray-600 dark:text-gray-400">View invoice details</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-400">Invoice viewing functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default ViewInvoice;
