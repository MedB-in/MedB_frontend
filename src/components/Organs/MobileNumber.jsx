import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { addMobileNumber, sendOtp } from '../../services/user';
import toast from 'react-hot-toast';
import InputField from '../Atoms/Login/InputField';
import Button from '../Atoms/Login/Button';

const MobileNumberModal = ({ setMobileModal }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ code: '' });
    const [loading, setLoading] = useState(false);

    const otpRefs = useRef([...Array(4)].map(() => React.createRef()));

    const handleSendOtp = async () => {
        try {
            const indianMobileRegex = /^[6-9]\d{9}$/;
            if (!indianMobileRegex.test(mobileNumber)) {
                toast.error('Please enter a valid 10-digit Indian mobile number.');
                return;
            }

            setLoading(true);
            await sendOtp({ contactNo: mobileNumber });
            setStep(2);
            toast.success('OTP sent successfully.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            if (formData.code.length !== 4) {
                toast.error('Please enter all 4 digits of the OTP.');
                return;
            }

            setLoading(true);
            await addMobileNumber({ contactNo: mobileNumber, otp: formData.code });
            const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
            userDetails.contactNo = mobileNumber;
            localStorage.setItem('userDetails', JSON.stringify(userDetails));

            toast.success('Mobile number verified and saved.');
            setStep(1);
            setMobileNumber('');
            setFormData({ code: '' });
            setMobileModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to verify OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpKeyDown = (e, index) => {
        const isBackspace = e.key === 'Backspace';
        const isEnter = e.key === 'Enter';

        if (isBackspace) {
            const newCode = formData.code.split('');
            newCode[index] = '';
            setFormData({ code: newCode.join('') });

            if (index > 0) {
                otpRefs.current[index - 1].current?.focus();
            }
        } else if (isEnter) {
            handleVerifyOtp();
        }
    };

    const handleClose = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'If you skip this step, communication will only be available via email.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, skip mobile verification',
        }).then((result) => {
            if (result.isConfirmed) {
                setMobileModal(false);
            }
        });
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-[1000]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

                <button
                    onClick={handleClose}
                    className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
                >
                    &times;
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    {step === 1 ? 'Enter Your Mobile Number' : 'Enter OTP'}
                </h2>
                <p className="text-sm mb-4 text-gray-600">
                    {step === 1
                        ? 'Your mobile number is required for communication and verification purposes.'
                        : `A 4-digit OTP has been sent to ${mobileNumber}.`}
                </p>

                {step === 1 ? (
                    <>
                        <InputField
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.trim())}
                            placeholder="Mobile Number"
                            maxLength={10}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendOtp();
                                    e.preventDefault();
                                }
                            }}
                        />
                        <Button onClick={handleSendOtp} disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center gap-3 mb-4">
                            {Array(4).fill('').map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={otpRefs.current[index]}
                                    className="w-14 h-14 text-2xl font-semibold text-center border border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
                                    value={formData.code[index] || ''}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/, '');
                                        const newCode = formData.code.split('');
                                        newCode[index] = val;
                                        const updatedCode = newCode.join('');
                                        setFormData({ code: updatedCode });

                                        if (val && index < 3) {
                                            otpRefs.current[index + 1].current?.focus();
                                        }

                                        if (updatedCode.length === 4 && !updatedCode.includes('')) {
                                            handleVerifyOtp();
                                        }
                                    }}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                />
                            ))}
                        </div>
                        <Button onClick={handleVerifyOtp} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Submit'}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileNumberModal;
