import React from "react";

const RefundCancellationPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-semibold mb-4">
        Refund & Cancellation Policy
      </h1>

      <p className="mb-4">
        Our refund and cancellation policy ensures a clear and fair experience
        for all users.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refund Eligibility</h2>
      <p className="mb-4">
        If a refund is approved, the amount will be credited automatically to
        your original payment method within
        <strong> 5–10 business days</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Non-Refundable Cases</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Refunds not applicable once a service or digital product is delivered.
        </li>
        <li>Incorrect information provided by the user during checkout.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Payment Gateway</h2>
      <p className="mb-4">
        All payments and refunds are processed securely.
        <strong>This refund system is powered by PhonePe.</strong>
      </p>
    </div>
  );
};

export default RefundCancellationPolicy;
