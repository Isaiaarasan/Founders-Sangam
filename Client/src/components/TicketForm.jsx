import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Tag,
  Hash,
  CreditCard,
  Building2,
  AlertCircle,
} from "lucide-react";

const InputField = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  icon: Icon,
  disabled,
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
      {label}
    </label>
    <div className="relative group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {Icon && (
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors pointer-events-none"
          size={18}
        />
      )}
    </div>
  </div>
);

const TicketForm = ({ event, onSubmit, loading, savedData, isRetry = false }) => {
  const [formData, setFormData] = useState({
    name: savedData?.name || "",
    companyName: savedData?.companyName || "",
    email: savedData?.email || "",
    contact: savedData?.contact || "",
    ticketType: savedData?.ticketType || "",
    quantity: savedData?.quantity || 1,
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const ticketOptions = event.ticketTypes || [];

  // Set default ticket type if available
  useEffect(() => {
    if (ticketOptions.length > 0 && !formData.ticketType) {
      setFormData((prev) => ({ ...prev, ticketType: ticketOptions[0].name }));
    }
  }, [ticketOptions]);

  // Sync form data when savedData changes (for retry scenarios)
  useEffect(() => {
    if (savedData) {
      setFormData({
        name: savedData.name || "",
        companyName: savedData.companyName || "",
        email: savedData.email || "",
        contact: savedData.contact || "",
        ticketType: savedData.ticketType || (ticketOptions.length > 0 ? ticketOptions[0].name : ""),
        quantity: savedData.quantity || 1,
      });
    }
  }, [savedData]);

  // Calculate Price
  useEffect(() => {
    const selectedTicket = ticketOptions.find(
      (t) => t.name === formData.ticketType
    );
    if (selectedTicket) {
      // Handle empty quantity safely
      const qty =
        formData.quantity === "" ? 0 : parseInt(formData.quantity) || 0;
      setTotalPrice(selectedTicket.price * qty);
    }
  }, [formData.ticketType, formData.quantity, ticketOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    // Allow empty string to let user clear the field
    if (val === "") {
      setFormData((prev) => ({ ...prev, quantity: "" }));
      return;
    }
    // Otherwise prompt for number but don't force fallback immediately on typing
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed >= 0) {
      setFormData((prev) => ({ ...prev, quantity: parsed }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure quantity is at least 1 before submitting
    const finalQty =
      formData.quantity === "" || formData.quantity < 1 ? 1 : formData.quantity;
    onSubmit({ ...formData, quantity: finalQty, amount: totalPrice });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Retry Banner */}
      {isRetry && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
              Payment Retry Mode
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Your registration details are locked. Click "Retry Payment" below to complete your payment.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <InputField
            label="Full Name"
            name="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            icon={User}
            disabled={isRetry}
          />
        </div>
        <div className="md:col-span-2">
          <InputField
            label="Company Name / Brand Name"
            name="companyName"
            type="text"
            placeholder="Your Company or Brand"
            value={formData.companyName}
            onChange={handleChange}
            icon={Building2}
            disabled={isRetry}
          />
        </div>
        <div>
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Your mail"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            disabled={isRetry}
          />
        </div>
        <div>
          <InputField
            label="Phone Number"
            name="contact"
            type="tel"
            placeholder="9876543210"
            value={formData.contact}
            onChange={handleChange}
            icon={Phone}
            disabled={isRetry}
          />
        </div>
        <div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Ticket Type
            </label>
            <div className="relative group">
              <select
                name="ticketType"
                value={formData.ticketType}
                onChange={handleChange}
                disabled={isRetry}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-slate-900 dark:text-white font-medium appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ticketOptions.map((t, idx) => (
                  <option key={idx} value={t.name}>
                    {t.name} - ₹{t.price}
                  </option>
                ))}
              </select>
              <Tag
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </div>
        <div>
          <InputField
            label="Quantity"
            name="quantity"
            type="number"
            placeholder="1"
            value={formData.quantity}
            onChange={handleQuantityChange}
            icon={Hash}
            disabled={isRetry}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Amount
          </p>
          <p className="text-3xl font-bold text-amber-500">₹{totalPrice}</p>
        </div>
        <button
          type="submit"
          disabled={loading || totalPrice === 0}
          className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : isRetry ? "Retry Payment" : "Proceed to Pay"}{" "}
          <CreditCard size={18} />
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
