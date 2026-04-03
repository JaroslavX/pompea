import React from 'react';

export default function Page() {
  return (
    <div className="content-page legacy-content" dangerouslySetInnerHTML={{ __html: `<!--  Article   -->
            <div class="svid">
                <h2>Помилка</h2>
            </div>
            <h2>
                <center>
                    Щось пішло не так…
                </center>
            </h2>
        </div>` }} />
  );
}
