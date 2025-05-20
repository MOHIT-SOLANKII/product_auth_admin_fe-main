import React from 'react';

export default function Dashboard() {

  return (
    <>
      <div className="absolute top-6 left-6">
        <div className="flex flex-col items-start">
          <img src="/logo.jpg" alt="Finolex" className="h-12 w-auto" />
        </div>
      </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center px-4">
    <div className="flex items-center gap-2">
      <img src="/rewardify-logo.png" alt="Rewardify Logo" className="h-8 w-auto" />
      <span className="text-xs text-gray-500 cursor-default">
        Rewardify - Loyalty & Reward Management System A Solution by Karmaa Lab (
        <a 
          href="https://karmaalab.com" 
          className="underline text-gray-500 hover:text-blue-500"
          target="_blank" 
          rel="noopener noreferrer"
        >
          karmaalab.com
        </a>
        )
      </span>
      </div>
    </div>
    </>
  );
}