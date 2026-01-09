import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Save, AlertCircle } from 'lucide-react';


interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (email: string, newValue: number) => void;
    initialValue: number;
    dataLabel: string;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, initialValue, dataLabel }) => {
    const [step, setStep] = useState<'email' | 'value' | 'confirm'>('email');
    const [email, setEmail] = useState('');
    const [value, setValue] = useState(initialValue.toString());
    const [existingValue, setExistingValue] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep('email');
            setValue(initialValue.toString());
            setError('');
            setExistingValue(null);
        }
    }, [isOpen, initialValue]);

    const checkEmail = async () => {
        if (!email.includes('@')) {
            setError('Please enter a valid email.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            // Check Supabase for existing config
            const { data } = await supabase
                .from('user_settings')
                .select('custom_value')
                .eq('email', email)
                .eq('setting_key', dataLabel)
                .single();

            if (data) {
                setExistingValue(data.custom_value);
                setValue(data.custom_value.toString()); // Pre-fill with existing
                setStep('confirm'); // Ask to overwrite
            } else {
                setStep('value');
            }
        } catch (err) {
            // If table doesn't exist or other error, just proceed to value step for this demo
            console.log("Supabase check failed (likely no table/config), proceeding locally.", err);
            setStep('value');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const numVal = parseFloat(value);
        if (isNaN(numVal)) {
            setError('Please enter a valid number');
            return;
        }

        setLoading(true);
        try {
            // Upsert to Supabase
            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    email,
                    setting_key: dataLabel,
                    custom_value: numVal,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'email, setting_key' });

            if (error) {
                console.error("Supabase Save Error:", error);
                // We continue updates locally even if server save fails for demo purposes
            }

            onSave(email, numVal);
            onClose();
        } catch (err) {
            console.error(err);
            onSave(email, numVal); // Optimistic UI
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl border border-slate-700 text-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Customize Data
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {step === 'email' && (
                    <div className="space-y-4">
                        <p className="text-slate-300">Please enter your email to load or save your custom preferences.</p>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-primary transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            onClick={checkEmail}
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-primary hover:bg-sky-400 text-slate-900 font-semibold transition-all disabled:opacity-50"
                        >
                            {loading ? 'Checking...' : 'Continue'}
                        </button>
                    </div>
                )}

                {step === 'confirm' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
                            <AlertCircle size={24} />
                            <p>We found a previous value: <strong>{existingValue}</strong></p>
                        </div>
                        <p className="text-slate-300">Would you like to overwrite it with a new value?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('value')}
                                className="flex-1 py-3 rounded-lg bg-primary text-slate-900 font-semibold"
                            >
                                Yes, Overwrite
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-lg bg-slate-700 text-white font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {step === 'value' && (
                    <div className="space-y-4">
                        <p className="text-slate-300">Set new value for <strong>{dataLabel}</strong></p>
                        <input
                            type="number"
                            className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-primary transition-all"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-slate-900 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex justify-center items-center gap-2"
                        >
                            <Save size={20} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}

                {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
            </div>
        </div>
    );
};
