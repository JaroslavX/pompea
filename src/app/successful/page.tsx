import React from 'react';

export default function Page() {
  return (
    <div className="content-page legacy-content" dangerouslySetInnerHTML={{ __html: `<!--  Article   -->
            <div class="svid">
                <h2>Результат відправки</h2>
            </div>
            <h2>
                <center>
                    Дякуємо, Ваше звернення прийняте
                </center>
            </h2>
        </div>` }} />
  );
}
