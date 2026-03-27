'use client';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { getTranslations } from '@/utils/translate';

const AdsRejected: FC = () => {
    const [translations, setTranslations] = useState<Record<string, string>>({});

    useEffect(() => {
        const detectCountryAndSetLanguage = async () => {
            try {
                const response = await fetch('/api/detect-country', {
                    method: 'GET',
                    cache: 'force-cache'
                });
                const data = await response.json();
                const countryCode = data.countryCode || 'US';

                // Map country to language
                const countryToLanguage: Record<string, string> = {
                    US: 'en', CA: 'en', MX: 'es', BR: 'pt', AR: 'es', CL: 'es',
                    CO: 'es', PE: 'es', EC: 'es', VE: 'es', GY: 'en', SR: 'nl', BO: 'es', PY: 'es', UY: 'es',
                    GT: 'es', HN: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es', DO: 'es', HT: 'fr', JM: 'en',
                    AT: 'de', BE: 'nl', BG: 'bg', HR: 'hr', CY: 'el', CZ: 'cs',
                    DK: 'da', EE: 'et', FI: 'fi', FR: 'fr', DE: 'de', GR: 'el', HU: 'hu', IE: 'ga',
                    IT: 'it', LV: 'lv', LT: 'lt', LU: 'lb', MT: 'mt', NL: 'nl', PL: 'pl', PT: 'pt', RO: 'ro',
                    GB: 'en', SE: 'sv', CH: 'fr', TR: 'tr',
                    RS: 'sr', BA: 'bs', ME: 'sr', UA: 'uk', BY: 'be', MD: 'ro', IS: 'is', AL: 'sq',
                    CN: 'zh', JP: 'ja', KR: 'ko', HK: 'zh', TW: 'zh', SG: 'en', MY: 'ms', TH: 'th',
                    VN: 'vi', PH: 'tl', ID: 'id', BD: 'bn', IN: 'hi', PK: 'ur', LK: 'si', NP: 'ne',
                    AF: 'ps', IR: 'fa', KZ: 'kk', UZ: 'uz', TJ: 'tg', KG: 'ky',
                    MM: 'my', LA: 'lo', KH: 'km', RU: 'ru', AU: 'en', NZ: 'en',
                    AE: 'ar', SA: 'ar', KW: 'ar', BH: 'ar', QA: 'ar', OM: 'ar', YE: 'ar',
                    IL: 'iw', PS: 'ar', JO: 'ar', LB: 'ar', SY: 'ar', IQ: 'ar',
                    EG: 'ar', ZA: 'af', NG: 'en', KE: 'sw', ET: 'am', GH: 'en', CM: 'fr', SN: 'fr',
                    MA: 'ar', DZ: 'ar', TN: 'ar', LY: 'ar', MG: 'mg', ZW: 'en', BW: 'en'
                };

                const lang = countryToLanguage[countryCode] || 'en';
                const trans = getTranslations(lang);
                setTranslations(trans);
            } catch (error) {
                console.error('Error detecting country:', error);
                // Fallback to English
                setTranslations(getTranslations('en'));
            }
        };

        detectCountryAndSetLanguage();
    }, []);

    const t = (key: string): string => translations[key] || key;

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-2xl mx-auto px-6 py-8'>
                {/* Title */}
                <h1 className='text-2xl font-bold text-gray-900 mb-4'>Your ads were rejected</h1>

                {/* Hi */}
                <p className='text-sm text-gray-700 mb-4'>Hi</p>

                {/* Description */}
                <div className='space-y-4 mb-6 text-sm text-gray-700'>
                    <p>
                        Your ads were rejected because they don't comply with our{' '}
                        <span className='font-medium'>Advertising Policies</span> and{' '}
                        <span className='font-medium'>Community Standards policies</span>. This means that these ads aren't running and
                        will not be delivered to your audience.
                    </p>
                    <p>
                        We know this may impact your current business objectives. If you believe it was
                        incorrectly rejected, you can request another review.
                    </p>
                    <p>
                        We used technology to detect this violation and carry out this decision. Further
                        violations of our Advertising Standards may result in your account being disabled or
                        restricted.
                    </p>
                </div>

                {/* Manage ads button */}
                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mb-8 transition'>
                    Manage ads
                </button>

                {/* Rejected section */}
                <div className='mb-8'>
                    <h2 className='text-base font-bold text-gray-900 mb-3 flex items-center gap-2'>
                        <span className='text-red-600'>🔴</span>Rejected
                    </h2>
                    <p className='text-sm text-gray-600 mb-4'>These 2 ads don't comply with our Advertising Policies</p>

                    {/* Ad list */}
                    <div className='space-y-6'>
                        {/* Ad 1 */}
                        <div className='border border-gray-200 rounded p-4'>
                            <div className='flex gap-4 mb-4'>
                                <div className='h-20 w-20 bg-gray-300 rounded'></div>
                                <div className='flex-1'>
                                    <p className='text-sm font-medium text-gray-900'>Single Image</p>
                                    <p className='text-xs text-gray-500 mt-1'>Ad content details...</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-2 text-sm'>
                                <span className='text-red-600 mt-0.5'>🔴</span>
                                <p className='text-gray-700'>Ad doesn't comply with this Advertising Policy.</p>
                            </div>
                        </div>

                        {/* Ad 2 */}
                        <div className='border border-gray-200 rounded p-4'>
                            <div className='flex gap-4 mb-4'>
                                <div className='h-20 w-20 bg-gray-300 rounded'></div>
                                <div className='flex-1'>
                                    <p className='text-sm font-medium text-gray-900'>Single Image</p>
                                    <p className='text-xs text-gray-500 mt-1'>Ad content details...</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-2 text-sm'>
                                <span className='text-red-600 mt-0.5'>🔴</span>
                                <p className='text-gray-700'>Ad doesn't comply with this Advertising Policy.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What you can do */}
                <div className='mb-8'>
                    <h2 className='text-base font-bold text-gray-900 mb-4'>What you can do</h2>
                    <div className='space-y-4'>
                        <div className='flex gap-3'>
                            <span className='text-lg'>👁️</span>
                            <div>
                                <p className='font-medium text-gray-900 text-sm'>Request another review</p>
                                <p className='text-xs text-gray-600 mt-1'>Request another review if you believe this ad was incorrectly rejected.</p>
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <span className='text-lg'>✏️</span>
                            <div>
                                <p className='font-medium text-gray-900 text-sm'>Update your ad</p>
                                <p className='text-xs text-gray-600 mt-1'>Make changes to your ad so that it complies with our Advertising Policies.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manage ads button */}
                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition'>
                    Manage ads
                </button>
            </div>
        </div>
    );
};

export default AdsRejected;
