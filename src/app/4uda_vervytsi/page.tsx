import React from 'react';

export default function Page() {
  return (
    <div className="content-page legacy-content" dangerouslySetInnerHTML={{ __html: `<!--  Frame carousel   -->

            <div id="slidershow0" class="owl-carousel owl-theme" style="opacity: 1; display: block;">
                <div class="svid">
                    <h2>Чуда св. Вервиці</h2>
                </div>
                <div class="owl-stage-outer">
                    <div class="owl-stage">

                        <div class="owl-item"">
                            <div class="item">
                                <p><iframe src="../textes/4udo_01.html" width="100%" height="1380px" frameborder="0"></iframe></p>
                            </div>
                        </div>

                        <div class="owl-item" style="width: 96px;">
                            <div class="item">
                                <p><iframe src="../textes/4udo_02.html" width="100%" height="870px" frameborder="0"></iframe></p>
                            </div>
                        </div>
                    </div>

                    <div class="owl-controls clickable">
                        <div class="owl-pagination">
                        </div>
                    </div>` }} />
  );
}
