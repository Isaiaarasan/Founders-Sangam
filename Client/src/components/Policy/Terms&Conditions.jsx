import React from "react";

const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-Black   leading-relaxed">
      <h1 className="text-3xl font-semibold mb-4">Terms & Conditions</h1>

      <p className="mb-4">
        By accessing or using this website, you agree to the following terms and
        conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Use of the Website</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Users must provide accurate information when creating accounts or
          making payments.
        </li>
        <li>
          The platform may modify or discontinue services without prior notice.
        </li>
        <li>
          No unlawful or harmful activity may be performed through the website.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Payments</h2>
      <p className="mb-4">
        All payments are handled securely by third-party payment gateways. You
        agree not to misuse the payment system for fraudulent purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Intellectual Property</h2>
      <p className="mb-4">
        All content, branding, graphics, and materials on this website belong to
        the platform and may not be copied or reused without permission.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Limitation of Liability
      </h2>
      <p className="mb-4">
        The platform is not responsible for technical issues, downtime, or data
        loss caused by external factors.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to update these terms at any time. Continued use of
        the website constitutes acceptance of the revised terms.
      </p>
    </div>
  );
};

export default TermsConditions;
