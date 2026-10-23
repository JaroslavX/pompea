import Honeypot from '../../components/Honeypot';
import { sendFeedbackSvid } from '../actions';

export default function Feedback2Page() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-[#0a4f3d] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Подати свідчення отриманої ласки
      </h1>

      <blockquote className="bg-gray-50 border-l-4 border-[#0a4f3d] p-4 text-gray-700 italic mb-8 rounded-r-lg">
        Хто одержить за допомогою Помпейської дев’ятниці вимолювану ласку, хай на знак подяки Цариці Святої Вервиці й для поширення набожності до Неї напише про це.
      </blockquote>

      <form action={sendFeedbackSvid} className="flex flex-col gap-6 bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
        <Honeypot />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold text-gray-700">Ім'я</label>
            <input id="name" name="name" type="text" maxLength={80} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12755c] outline-none" placeholder="Ім'я" minLength={3} required />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="surname" className="font-semibold text-gray-700">Прізвище / Псевдонім</label>
            <input id="surname" name="surname" type="text" maxLength={80} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12755c] outline-none" placeholder="Прізвище" minLength={3} required />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold text-gray-700">E-Mail</label>
          <input id="email" name="email" type="email" maxLength={254} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12755c] outline-none" placeholder="E-Mail" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-semibold text-gray-700">Контактний телефон</label>
            <input id="phone" name="phone" type="text" maxLength={40} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12755c] outline-none" placeholder="Телефон" />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="place" className="font-semibold text-gray-700">Місцевість</label>
            <input id="place" name="place" type="text" maxLength={120} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12755c] outline-none" placeholder="Місцевість" minLength={3} required />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="font-semibold text-gray-700">Свідчення</label>
          <textarea id="message" name="msg" maxLength={5000} className="w-full p-3 border border-gray-300 rounded-lg min-h-[200px] focus:ring-2 focus:ring-[#12755c] outline-none" placeholder="Опишіть вашу історію..." minLength={3} required></textarea>
        </div>

        <button type="submit" className="mt-4 bg-[#0a4f3d] hover:bg-[#12755c] text-white font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:-translate-y-1">
          Надіслати Свідчення
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6 text-center">
        *Персональні дані не будуть передані третім особам. Вони служать тільки як доказ правдивості.
      </p>
    </div>
  );
}
