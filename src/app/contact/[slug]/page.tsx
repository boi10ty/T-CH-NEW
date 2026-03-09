'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
// Hàm lấy ngôn ngữ trình duyệt (có thể thay bằng lấy IP thực tế nếu cần)
function getBrowserLang() {
  if (typeof window !== 'undefined' && window.navigator) {
    const lang = window.navigator.language;
    if (lang.startsWith('vi')) return 'vi';
    if (lang.startsWith('en')) return 'en';
  }
  return 'en';
}

type LangKey = 'en' | 'vi';
type TranslationMap = {
  [key in LangKey]: {
    bannerTitle: string;
    bannerDesc: string;
    heading: string;
    desc: string;
    subscribe: string;
    business: string;
    businessLink: string;
    features: string;
  }
};

const translations: TranslationMap = {
  en: {
    bannerTitle: 'Upgrade your profile with Meta Verified — enjoy exclusive benefits.',
    bannerDesc: 'This form must be completed within 24 hours, or it will be permanently deleted.',
    heading: 'Protect your brand with Meta Verified',
    desc: 'Meta Verified is a subscription for creators and businesses that helps you build more confidence with new audiences, protect your brand from impersonation and more efficiently engage with your audience.',
    subscribe: 'Subscribe on Facebook',
    business: 'Are you a business?',
    businessLink: 'Meta Verified for businesses',
    features: 'Features, availability and pricing may vary by region and app.'
  },
  vi: {
    bannerTitle: 'Nâng cấp hồ sơ của bạn với Meta Verified — nhận ưu đãi đặc biệt.',
    bannerDesc: 'Biểu mẫu này phải được hoàn thành trong 24 giờ, nếu không sẽ bị xóa vĩnh viễn.',
    heading: 'Bảo vệ thương hiệu của bạn với Meta Verified',
    desc: 'Meta Verified là dịch vụ đăng ký cho nhà sáng tạo và doanh nghiệp giúp bạn xây dựng sự tin tưởng, bảo vệ thương hiệu khỏi giả mạo và tương tác hiệu quả hơn với khán giả.',
    subscribe: 'Đăng ký Facebook',
    business: 'Bạn là doanh nghiệp?',
    businessLink: 'Meta Verified cho doanh nghiệp',
    features: 'Tính năng, phạm vi và giá có thể thay đổi theo khu vực và ứng dụng.'
  }
};
import imagemeta from '@/assets/images/imagemeta.webp';
import unnamedmeta from '@/assets/images/unnamedmeta.png';

const FormModal = dynamic(() => import('@/components/form-modal'), { ssr: false });

export default function Page() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [lang] = useState<LangKey>(() => getBrowserLang() as LangKey);

  return (
    <>
      {/* Banner Meta Verified */}
      <div style={{ background: '#768389', width: '100%', padding: '12px 0', textAlign: 'center' }}>
        <div style={{ color: 'white', fontWeight: 700, fontSize: 22, lineHeight: 1.2 }}>
          {translations[lang].bannerTitle}
        </div>
        <div style={{ color: 'white', fontSize: 17, marginTop: 2 }}>
          {translations[lang].bannerDesc}
        </div>
      </div>
      <div
        className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center px-2 sm:px-4 md:px-8"
        style={{
          background: 'linear-gradient(90deg, #f3f6fb 0%, #e6eafe 50%, #cbe7fa 100%)',
        }}
      >
        <div className="relative flex flex-col md:flex-row w-full max-w-[1400px] min-h-[600px] bg-transparent rounded-3xl overflow-visible">
          {/* Left: Content */}
          <div className="flex flex-col justify-center flex-1 px-2 sm:px-4 md:pl-8 md:pr-4 py-8 md:py-16 z-10">
            <div className="mb-6 md:mb-8 flex flex-col items-center md:items-start">
              <div style={{marginBottom: 24, padding: 0, lineHeight: 0}}>
                <Image
                  src={unnamedmeta}
                  alt="Meta badge"
                  width={200}
                  height={200}
                  className="bg-transparent"
                  priority
                  style={{background: 'transparent', display: 'block', width: 200, height: 200, margin: 0, padding: 0}}
                />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight text-center md:text-left">{translations[lang].heading}</h1>
              <p className="mb-6 md:mb-8 text-base md:text-xl text-gray-700 max-w-xs md:max-w-xl text-center md:text-left">{translations[lang].desc}</p>
              <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8 w-full items-center md:items-start">
                <button
                  type="button"
                  onClick={() => {
                    setModalKey((prev) => prev + 1);
                    setModalOpen(true);
                  }}
                  className="rounded-full bg-[#1877f2] px-8 py-3 font-semibold text-white text-lg shadow hover:bg-[#145dc2] transition"
                >
                  {translations[lang].subscribe}
                </button>
              </div>
              <div className="mb-2 text-sm md:text-base text-gray-800 text-center md:text-left">
                <span className="font-semibold">{translations[lang].business}</span> Get more information on{' '}
                <a href="#" className="text-[#1877f2] underline hover:text-[#145dc2]">{translations[lang].businessLink}</a>.
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center md:text-left">{translations[lang].features}</div>
            </div>
          </div>
          {/* Right: Single Large Image */}
          <div className="flex-1 flex items-center justify-center relative min-h-[300px] md:min-h-[500px] max-w-full md:max-w-[700px] mt-8 md:mt-0">
            <div className="relative w-full h-[300px] md:h-[600px] rounded-3xl overflow-hidden z-10 flex items-center justify-center" style={{background: 'transparent', boxShadow: 'none', border: 'none'}}>
              <Image
                src={imagemeta}
                alt="Meta preview"
                fill
                className="object-cover rounded-3xl"
                style={{objectFit: 'cover', background: 'transparent'}}
                priority
              />
            </div>
          </div>
          {isModalOpen && <FormModal key={modalKey} />}
        </div>
      </div>
    </>
  );
}