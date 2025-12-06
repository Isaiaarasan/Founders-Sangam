import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Tag, Hash, CreditCard } from 'lucide-react';

const InputField = ({ label, type, name, placeholder, value, onChange, icon: Icon, disabled }) => (
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

const TicketForm = ({ event, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        ticketType: '',
        quantity: 1,
    });
    const [totalPrice, setTotalPrice] = useState(0);

    const ticketOptions = event.ticketTypes || [];

    // Set default ticket type if available
    useEffect(() => {
        if (ticketOptions.length > 0 && !formData.ticketType) {
            setFormData(prev => ({ ...prev, ticketType: ticketOptions[0].name }));
        }
    }, [ticketOptions]);

    // Calculate Price
    useEffect(() => {
        const selectedTicket = ticketOptions.find(t => t.name === formData.ticketType);
        if (selectedTicket) {
            setTotalPrice(selectedTicket.price * formData.quantity);
        }
    }, [formData.ticketType, formData.quantity, ticketOptions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, amount: totalPrice });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <InputField
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        icon={User}
                    />
                </div>
                <div>
                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        icon={Mail}
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
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-slate-900 dark:text-white font-medium appearance-none"
                            >
                                {ticketOptions.map((t, idx) => (
                                    <option key={idx} value={t.name}>{t.name} - ₹{t.price}</option>
                                ))}
                            </select>
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
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
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        icon={Hash}
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
                    <p className="text-3xl font-bold text-amber-500">₹{totalPrice}</p>
                </div>
                <button
                    type="submit"
                    disabled={loading || totalPrice === 0}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : 'Proceed to Pay'} <CreditCard size={18} />
                </button>
            </div>
        </form>
    );
};

export default TicketForm;
