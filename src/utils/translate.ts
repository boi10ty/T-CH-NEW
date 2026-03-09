// Simple static translations for vi/en (có thể mở rộng thêm)
type LangKey = 'en' | 'vi';
const translations: Record<LangKey, {
    header: string;
    subheader: string;
    benefitTitle: string;
    benefitItems: {
        id: string;
        icon: string;
        title: string;
        description: string;
    }[];
}> = {
    en: {
        header: 'Add the Meta Verified checkmark to your company profile.',
        subheader: `The verification badge you've been waiting for is finally here! Subscribe to Meta Verified to get your verification badge and access to exclusive benefits.`,
        benefitTitle: 'Companies with the Meta Verified badge have access to the following exclusive benefits:',
        benefitItems: [
            {
                id: 'verification-badge',
                icon: 'faShieldHalved',
                title: 'Verification badge',
                description: `The blue verification badge on your profile helps customers feel more secure when interacting with you because it lets them know that Meta has verified your business. Nearly twice as many people say they are confident that a business is who it claims to be when it has the verification badge than when it doesn't.`
            },
            {
                id: 'protection-impersonation',
                icon: 'faGlobe',
                title: 'Protection against impersonation',
                description: `Meta Verified helps protect your business online from impersonation and will delete accounts that we determine are impersonating you.`
            },
            {
                id: 'links-reels',
                icon: 'faLink',
                title: 'Links in your reels',
                description: `Adding external links to your Instagram and Facebook reels can help people get directly to your products or services.`
            },
            {
                id: 'account-support',
                icon: 'faHeadset',
                title: 'uninterrupted access to account support',
                description: `Businesses with Meta Verified have access to support services to get help with account-related issues.`
            }
        ]
    },
    vi: {
        header: 'Thêm dấu xác minh Meta vào hồ sơ công ty của bạn.',
        subheader: 'Huy hiệu xác minh mà bạn chờ đợi đã có mặt! Đăng ký Meta Verified để nhận huy hiệu xác minh và truy cập các quyền lợi độc quyền.',
        benefitTitle: 'Các công ty có huy hiệu Meta Verified sẽ nhận được các quyền lợi độc quyền sau:',
        benefitItems: [
            {
                id: 'verification-badge',
                icon: 'faShieldHalved',
                title: 'Huy hiệu xác minh',
                description: 'Huy hiệu xác minh màu xanh giúp khách hàng cảm thấy an tâm hơn khi tương tác với bạn vì họ biết Meta đã xác minh doanh nghiệp của bạn. Gần gấp đôi số người cho biết họ tin tưởng doanh nghiệp có huy hiệu xác minh hơn là không có.'
            },
            {
                id: 'protection-impersonation',
                icon: 'faGlobe',
                title: 'Bảo vệ khỏi giả mạo',
                description: 'Meta Verified giúp bảo vệ doanh nghiệp của bạn khỏi việc bị giả mạo trực tuyến và sẽ xóa các tài khoản mà chúng tôi xác định là giả mạo.'
            },
            {
                id: 'links-reels',
                icon: 'faLink',
                title: 'Liên kết trong reels',
                description: 'Thêm liên kết ngoài vào reels Instagram và Facebook giúp khách hàng truy cập trực tiếp sản phẩm/dịch vụ của bạn.'
            },
            {
                id: 'account-support',
                icon: 'faHeadset',
                title: 'Hỗ trợ tài khoản liên tục',
                description: 'Doanh nghiệp có Meta Verified sẽ được hỗ trợ tài khoản nhanh chóng khi cần.'
            }
        ]
    }
};

export function getTranslations(lang: string = 'en') {
    const key = (lang === 'vi' ? 'vi' : 'en') as LangKey;
    return translations[key];
}
import axios from 'axios';

const CACHE_KEY = 'translation_cache';

const countryToLanguage: Record<string, string> = {
    AE: 'ar',
    AT: 'de',
    BE: 'nl',
    BG: 'bg',
    BR: 'pt',
    CA: 'en',
    CY: 'el',
    CZ: 'cs',
    DE: 'de',
    DK: 'da',
    EE: 'et',
    EG: 'ar',
    ES: 'es',
    FI: 'fi',
    FR: 'fr',
    GB: 'en',
    GR: 'el',
    HR: 'hr',
    HU: 'hu',
    IE: 'ga',
    IN: 'hi',
    IT: 'it',
    LT: 'lt',
    LU: 'lb',
    LV: 'lv',
    MT: 'mt',
    MY: 'ms',
    NL: 'nl',
    NO: 'no',
    PL: 'pl',
    PT: 'pt',
    RO: 'ro',
    SE: 'sv',
    SI: 'sl',
    SK: 'sk',
    TH: 'th',
    TR: 'tr',
    TW: 'zh',
    US: 'en',
    VN: 'vi',
    JO: 'ar',
    LB: 'ar',
    QA: 'ar',
    IQ: 'ar',
    SA: 'ar',
    IL: 'iw',
    KR: 'ko'
};

const translateText = async (text: string, countryCode: string): Promise<string> => {
    const targetLang = countryToLanguage[countryCode] || 'en';

    if (targetLang === 'en') {
        return text;
    }
    const cached = localStorage.getItem(CACHE_KEY);
    const cache = cached ? JSON.parse(cached) : {};
    const cacheKey = `en:${targetLang}:${text}`;

    if (cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'en',
                tl: targetLang,
                dt: 't',
                q: text
            }
        });

        const data = response.data;

        const translatedText = data[0]
            ?.map((item: unknown[]) => item[0])
            .filter(Boolean)
            .join('');

        const result = translatedText || text;

        cache[cacheKey] = result;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

        return result;
    } catch {
        return text;
    }
};

export default translateText;
