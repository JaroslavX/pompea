import clientPromise from '../lib/db';
import Link from 'next/link';
import { dailyPage } from '../lib/dailyPage';

export const dynamic = 'force-dynamic';

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const itemsPerPage = 1;
  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  // No ?page= means the plain home page: show the testimony of the day.
  // An explicit ?page=N (pagination links) shows exactly that page.
  const showDaily = pageParam === undefined;
  let page = parseInt((pageParam as string) || '1', 10);

  if (isNaN(page) || page < 1) page = 1;

  try {
    const client = await clientPromise;
    const db = client.db('site');
    const collection = db.collection('testimonials');

    const totalItems = await collection.countDocuments();
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (showDaily) page = dailyPage(totalItems, itemsPerPage);
    if (page > totalPages) page = totalPages;

    const offset = (page - 1) * itemsPerPage;
    const rawRows = await collection.find({})
      .sort({ _id: -1 })
      .skip(offset)
      .limit(itemsPerPage)
      .toArray();

    const rows = rawRows.map(doc => ({
      _id: doc._id.toString(),
      title: doc.title,
      text: doc.text,
      author: doc.author,
      date: doc.date
    }));

    return (
      <div className="flex flex-col gap-6">

        {rows.length > 0 ? (
          rows.map((t: any) => (
            <div key={t._id} className="testimonial-card">
              <div className="testimonial-card-body">
                <h3 className="article-title">{t.title}</h3>
                <p className="textPublication whitespace-pre-wrap">{t.text}</p>
              </div>
              <div className="testimonial-card-footer">
                <span className="font-semibold">{t.author}</span>
                <span>{t.date}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">Немає свідчень для відображення.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center flex-wrap gap-1.5 mt-6 pt-6 border-t border-[#d1e8da]">
            {page > 1 && (
              <>
                <Link href="/?page=1" className="px-3 py-1.5 text-sm border border-[#d1e8da] rounded-md hover:bg-[#12755c] hover:text-white hover:border-[#12755c] transition-colors" style={{ background: '#fffffe' }}>Перша</Link>
                <Link href={`/?page=${page - 1}`} className="px-3 py-1.5 text-sm border border-[#d1e8da] rounded-md hover:bg-[#12755c] hover:text-white hover:border-[#12755c] transition-colors" style={{ background: '#fffffe' }}>Попередня</Link>
              </>
            )}

            {Array.from({ length: 5 }, (_, i) => page - 2 + i)
              .filter(i => i > 0 && i <= totalPages)
              .map(i => (
                <Link
                  key={i}
                  href={`/?page=${i}`}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                    i === page
                      ? 'bg-[#0a4f3d] text-white border-[#0a4f3d] font-bold'
                      : 'border-[#d1e8da] text-[#2d4a3e] hover:bg-[#12755c] hover:text-white hover:border-[#12755c]'
                  }`}
                  style={i !== page ? { background: '#fffffe' } : {}}
                >
                  {i}
                </Link>
              ))
            }

            {page < totalPages && (
              <>
                <Link href={`/?page=${page + 1}`} className="px-3 py-1.5 text-sm border border-[#d1e8da] rounded-md hover:bg-[#12755c] hover:text-white hover:border-[#12755c] transition-colors" style={{ background: '#fffffe' }}>Наступна</Link>
                <Link href={`/?page=${totalPages}`} className="px-3 py-1.5 text-sm border border-[#d1e8da] rounded-md hover:bg-[#12755c] hover:text-white hover:border-[#12755c] transition-colors" style={{ background: '#fffffe' }}>Остання</Link>
              </>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("DB Error: ", error);
    return <div className="text-red-500 p-8 text-center bg-red-50 rounded-lg">Помилка завантаження бази даних. Перевірте з&apos;єднання у cPanel.</div>;
  }
}
