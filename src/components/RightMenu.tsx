'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = ["/images/subscribe_1.png", "/images/subscribe_2.png", "/images/subscribe_3.png"];

export default function RightMenu() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Social Media */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold border-b pb-2 mb-4 text-[#0a4f3d]">Свідчення у соцмережах</h4>
        <div className="flex flex-col gap-3">
          <a href="https://invite.viber.com/?g2=AQBXsnDEQFsXQUpwI0GCfsRdwtCiQnIEA6OsCVMT%2F1%2BJ11GeOAs3v809jBT5t58X" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#12755c] transition-all">
            <Image src="/images/Viber-512.png" alt="Viber" width={24} height={24} /> Підписатись у Viber
          </a>
          <a href="https://www.facebook.com/groups/2448714671891564/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#12755c] transition-all">
            <Image src="/images/facebook.png" alt="Facebook" width={24} height={24} /> Підписатись у Facebook
          </a>
          <a href="https://instagram.com/pompeiska_novena?igshid=rg9cklgw8dvp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#12755c] transition-all">
            <Image src="/images/Instagram-Icon.png" alt="Instagram" width={24} height={24} /> Підписатись в Instagram
          </a>
          <a href="https://t.me/SaintMaryPompey" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#12755c] transition-all">
            <Image src="/images/Telegram.svg" alt="Telegram" width={24} height={24} /> Підписатись у Telegram
          </a>
          <a href="https://chat.whatsapp.com/JMHGOvQJSNEE3JWL1Mg6mj" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#12755c] transition-all">
            <Image src="/images/whatsapp.png" alt="WhatsApp" width={24} height={24} /> Підписатись у WhatsApp
          </a>
        </div>
      </div>

      {/* Novena */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold border-b pb-2 mb-4 text-[#0a4f3d]">Помпейська дев’ятниця</h4>
        <div className="flex flex-col gap-3">
          <Link href="/" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Свідчення про чуда</Link>
          <Link href="/istorija_deviatnytsi" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Історія Помпейської дев’ятниці</Link>
          <Link href="/jak_molytysia_devytnitsy" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Як молитися Помпейську дев’ятницю</Link>
          <Link href="/ymovy_perestorogy" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Зауваги та умови</Link>
        </div>
      </div>

      {/* Rosary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold border-b pb-2 mb-4 text-[#0a4f3d]">Вервиця</h4>
        <div className="flex flex-col gap-3">
          <Link href="/istorija_vervytsi" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Історія св. Вервиці</Link>
          <Link href="/obitnytsi_vervytsi" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Обітниці св. Вервиці</Link>
          <Link href="/peremogy_vervytsi" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Перемоги св. Вервиці</Link>
          <Link href="/jak_molytysia_na_vervytsi" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Як молитися на вервиці</Link>
          <Link href="/4uda_vervytsi" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Вервиця – ліки для світу</Link>
        </div>
      </div>

      {/* Paraman */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold border-b pb-2 mb-4 text-[#0a4f3d]">Параман</h4>
        <div className="flex flex-col gap-3">
          <Link href="/istorija_paramanu" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Кармелітанський Параман</Link>
          <Link href="/obovjazky_paramanu" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Привілеї та обов’язки</Link>
          <Link href="/4uda_paramanu" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Чуда св. Параману</Link>
          <Link href="/zelenyj_paraman" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Зелений Параман</Link>
          <Link href="/5kratnyj_paraman" className="hover:text-[#12755c] hover:translate-x-1 transition-all">П’ятикратний Параман</Link>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold border-b pb-2 mb-4 text-[#0a4f3d]">Зворотній зв'язок</h4>
        <div className="flex flex-col gap-3">
          <Link href="/feedback" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Поставити запитання</Link>
          <Link href="/feedback2" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Надіслати свідчення</Link>
          <Link href="/pozertva" className="hover:text-[#12755c] hover:translate-x-1 transition-all">Пожертва на Духовну Семінарію</Link>
        </div>
      </div>

      {/* Extras */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        <a href="https://www.patreon.com/user?u=68619696" target="_blank" rel="noopener noreferrer">
          <small className="block mb-4">Помпейські свідчення друкуються в газеті "Греко-Католицька Традиція"</small>
          <div className="relative w-full h-[270px]">
            <Image src={images[currentImage]} alt="Subscribe" fill className="object-contain transition-opacity duration-500" />
          </div>
        </a>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        <a href="https://www.saintjosaphat.org/" target="_blank" rel="noopener noreferrer">
          <small className="block mb-4">Посилання на сайт Священичого Братства Святого Йосафата</small>
          <div className="relative w-[125px] h-[120px] mx-auto">
            <Image src="/images/bratstvo.png" alt="Братство" fill className="object-contain" />
          </div>
        </a>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
        <Link href="/pozertva">
          <small className="block mb-4">Пожертва на Духовну Семінарію Непорочного Серця Матері Божої Фатімської</small>
          <div className="relative w-[240px] h-[160px] mx-auto">
            <Image src="/images/pozertva.jpg" alt="Charity" fill className="object-cover rounded-md" />
          </div>
        </Link>
      </div>

    </div>
  );
}
