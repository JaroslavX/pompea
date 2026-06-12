'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = ["/images/subscribe_1.png", "/images/subscribe_2.png", "/images/subscribe_3.png"];

/** Reusable sidebar card with a dark-green header band */
function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl shadow-sm border border-[#d1e8da] overflow-hidden" style={{ background: '#f0f9f4' }}>
      <h4
        className="text-sm font-bold px-4 py-2.5 m-0 tracking-wide"
        style={{ background: '#0a4f3d', color: 'white' }}
      >
        {title}
      </h4>
      <div className="flex flex-col gap-0 p-3">
        {children}
      </div>
    </div>
  );
}

/** Navigation link row with a chevron indicator */
function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm py-1.5 px-2 rounded-md transition-all duration-150 hover:bg-[#d1e8da] hover:text-[#0a4f3d] hover:translate-x-0.5 text-[#2d4a3e]"
    >
      <span className="text-[#12755c] text-xs font-bold flex-shrink-0">›</span>
      {children}
    </Link>
  );
}

/** External anchor link row with a chevron indicator */
function SidebarAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm py-1.5 px-2 rounded-md transition-all duration-150 hover:bg-[#d1e8da] hover:text-[#0a4f3d] hover:translate-x-0.5 text-[#2d4a3e]"
    >
      {children}
    </a>
  );
}

export default function RightMenu() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4">

      {/* Social Media */}
      <SidebarCard title="Свідчення у соцмережах">
        <SidebarAnchor href="https://invite.viber.com/?g2=AQBXsnDEQFsXQUpwI0GCfsRdwtCiQnIEA6OsCVMT%2F1%2BJ11GeOAs3v809jBT5t58X">
          <Image src="/images/Viber-512.png" alt="Viber" width={20} height={20} className="flex-shrink-0" />
          Підписатись у Viber
        </SidebarAnchor>
        <SidebarAnchor href="https://www.facebook.com/groups/2448714671891564/">
          <Image src="/images/facebook.png" alt="Facebook" width={20} height={20} className="flex-shrink-0" />
          Підписатись у Facebook
        </SidebarAnchor>
        <SidebarAnchor href="https://instagram.com/pompeiska_novena?igshid=rg9cklgw8dvp">
          <Image src="/images/Instagram-Icon.png" alt="Instagram" width={20} height={20} className="flex-shrink-0" />
          Підписатись в Instagram
        </SidebarAnchor>
        <SidebarAnchor href="https://t.me/SaintMaryPompey">
          <Image src="/images/Telegram.svg" alt="Telegram" width={20} height={20} className="flex-shrink-0" />
          Підписатись у Telegram
        </SidebarAnchor>
        <SidebarAnchor href="https://chat.whatsapp.com/JMHGOvQJSNEE3JWL1Mg6mj">
          <Image src="/images/whatsapp.png" alt="WhatsApp" width={20} height={20} className="flex-shrink-0" />
          Підписатись у WhatsApp
        </SidebarAnchor>
      </SidebarCard>

      {/* Novena */}
      <SidebarCard title="Помпейська дев'ятниця">
        <SidebarLink href="/">Свідчення про чуда</SidebarLink>
        <SidebarLink href="/istorija_deviatnytsi">Історія Помпейської дев'ятниці</SidebarLink>
        <SidebarLink href="/jak_molytysia_devytnitsy">Як молитися Помпейську дев'ятницю</SidebarLink>
        <SidebarLink href="/ymovy_perestorogy">Зауваги та умови</SidebarLink>
      </SidebarCard>

      {/* Rosary */}
      <SidebarCard title="Вервиця">
        <SidebarLink href="/istorija_vervytsi">Історія св. Вервиці</SidebarLink>
        <SidebarLink href="/obitnytsi_vervytsi">Обітниці св. Вервиці</SidebarLink>
        <SidebarLink href="/peremogy_vervytsi">Перемоги св. Вервиці</SidebarLink>
        <SidebarLink href="/jak_molytysia_na_vervytsi">Як молитися на вервиці</SidebarLink>
        <SidebarLink href="/4uda_vervytsi">Вервиця – ліки для світу</SidebarLink>
      </SidebarCard>

      {/* Paraman */}
      <SidebarCard title="Параман">
        <SidebarLink href="/istorija_paramanu">Кармелітанський Параман</SidebarLink>
        <SidebarLink href="/obovjazky_paramanu">Привілеї та обов'язки</SidebarLink>
        <SidebarLink href="/4uda_paramanu">Чуда св. Параману</SidebarLink>
        <SidebarLink href="/zelenyj_paraman">Зелений Параман</SidebarLink>
        <SidebarLink href="/5kratnyj_paraman">П'ятикратний Параман</SidebarLink>
      </SidebarCard>

      {/* Feedback */}
      <SidebarCard title="Зворотній зв'язок">
        <SidebarLink href="/feedback">Поставити запитання</SidebarLink>
        <SidebarLink href="/feedback2">Надіслати свідчення</SidebarLink>
        <SidebarLink href="/pozertva">Пожертва на Духовну Семінарію</SidebarLink>
      </SidebarCard>

      {/* Newspaper subscription banner */}
      <div className="rounded-xl shadow-sm border border-[#d1e8da] overflow-hidden" style={{ background: '#f0f9f4' }}>
        <p className="text-xs font-bold px-4 py-2.5 m-0 tracking-wide" style={{ background: '#0a4f3d', color: 'white' }}>
          Наші партнери
        </p>
        <a href="https://www.patreon.com/user?u=68619696" target="_blank" rel="noopener noreferrer" className="block p-3 hover:opacity-90 transition-opacity">
          <p className="text-xs text-center text-[#2d4a3e] mb-3">Помпейські свідчення друкуються в газеті «Греко-Католицька Традиція»</p>
          <div className="relative w-full h-[260px]">
            <Image src={images[currentImage]} alt="Subscribe" fill sizes="(max-width: 768px) 100vw, 250px" className="object-contain transition-opacity duration-500" />
          </div>
        </a>
      </div>

      {/* Bratstvo */}
      <div className="rounded-xl shadow-sm border border-[#d1e8da] overflow-hidden text-center" style={{ background: '#f0f9f4' }}>
        <a href="https://www.saintjosaphat.org/" target="_blank" rel="noopener noreferrer" className="block p-4 hover:opacity-90 transition-opacity">
          <p className="text-xs text-[#2d4a3e] mb-3">Сайт Священичого Братства Святого Йосафата</p>
          <div className="relative w-[110px] h-[110px] mx-auto rounded-lg overflow-hidden shadow-sm">
            <Image src="/images/bratstvo.png" alt="Братство" fill sizes="110px" className="object-contain" />
          </div>
        </a>
      </div>

      {/* Charity */}
      <div className="rounded-xl shadow-sm border border-[#d1e8da] overflow-hidden text-center" style={{ background: '#f0f9f4' }}>
        <Link href="/pozertva" className="block p-4 hover:opacity-90 transition-opacity">
          <p className="text-xs text-[#2d4a3e] mb-3">Пожертва на Духовну Семінарію Непорочного Серця Матері Божої Фатімської</p>
          <div className="relative w-[220px] h-[150px] mx-auto rounded-lg overflow-hidden shadow-sm">
            <Image src="/images/pozertva.jpg" alt="Charity" fill sizes="220px" className="object-cover" />
          </div>
        </Link>
      </div>

    </div>
  );
}
