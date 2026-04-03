import clientPromise from '../lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const itemsPerPage = 1;
  const searchParams = await props.searchParams;
  const pageStr = searchParams?.page || '1';
  let page = parseInt(pageStr as string, 10);
  
  if (isNaN(page) || page < 1) page = 1;

  try {
    const client = await clientPromise;
    const db = client.db('site');
    const collection = db.collection('testimonials');

    const totalItems = await collection.countDocuments();
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (page > totalPages) page = totalPages;

    const offset = (page - 1) * itemsPerPage;
    const rawRows = await collection.find({})
      .sort({ _id: -1 }) // Sort newest first automatically by Mongo's Timestamped ID
      .skip(offset)
      .limit(itemsPerPage)
      .toArray();

    // Map Mongo Document _id to a simple string to pass cleanly to Client Components
    const rows = rawRows.map(doc => ({
      _id: doc._id.toString(),
      title: doc.title,
      text: doc.text,
      author: doc.author,
      date: doc.date
    }));

    return (
      <div className="flex flex-col gap-6">
        <div className="svid">
          <h2>Свідчення</h2>
        </div>

        {rows.length > 0 ? (
          rows.map((t: any) => (
            <div key={t._id} className="testimonial-card">
              <h3 className="article-title">{t.title}</h3>
              <p className="textPublication whitespace-pre-wrap">{t.text}</p>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-sm font-semibold text-[#12755c]">
                <span>{t.author}</span>
                <span>{t.date}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">Немає свідчень для відображення.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center flex-wrap gap-2 mt-8">
            {page > 1 && (
              <>
                <Link href="/?page=1" className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-[#12755c] hover:text-white transition-colors">Перша</Link>
                <Link href={`/?page=${page - 1}`} className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-[#12755c] hover:text-white transition-colors">Попередня</Link>
              </>
            )}

            {Array.from({ length: 5 }, (_, i) => page - 2 + i)
              .filter(i => i > 0 && i <= totalPages)
              .map(i => (
                <Link 
                  key={i} 
                  href={`/?page=${i}`}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    i === page 
                      ? 'bg-[#0a4f3d] text-white border-[#0a4f3d]' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-[#12755c] hover:text-white hover:border-[#12755c]'
                  }`}
                >
                  {i}
                </Link>
              ))
            }

            {page < totalPages && (
              <>
                <Link href={`/?page=${page + 1}`} className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-[#12755c] hover:text-white transition-colors">Наступна</Link>
                <Link href={`/?page=${totalPages}`} className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-[#12755c] hover:text-white transition-colors">Остання</Link>
              </>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("DB Error: ", error);
    return <div className="text-red-500 p-8 text-center bg-red-50 rounded-lg">Помилка завантаження бази даних. Перевірте з'єднання у cPanel.</div>;
  }
}
