import { sendFeedbackMsg } from '../actions';

export default function FeedbackPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-[#0a4f3d] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Форма зворотнього зв'язку
      </h1>

      <form action={sendFeedbackMsg} className="flex flex-col gap-6 bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-semibold text-gray-700">Ім'я та Прізвище</label>
          <input id="name" name="name" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12755c] outline-none transition-all" placeholder="Ім'я та Прізвище" minLength={3} required />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold text-gray-700">E-Mail</label>
          <input id="email" name="email" type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12755c] outline-none transition-all" placeholder="E-Mail" required />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="font-semibold text-gray-700">Контактний телефон</label>
          <input id="phone" name="phone" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12755c] outline-none transition-all" placeholder="Контактний телефон" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="font-semibold text-gray-700">Звернення</label>
          <textarea id="message" name="msg" className="w-full p-3 border border-gray-300 rounded-lg min-h-[200px] focus:ring-2 focus:ring-[#12755c] outline-none transition-all" placeholder="Ваше звернення..." minLength={3} required></textarea>
        </div>

        <button type="submit" className="mt-4 bg-[#0a4f3d] hover:bg-[#12755c] text-white font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:-translate-y-1">
          Надіслати
        </button>
      </form>
    </div>
  );
}
