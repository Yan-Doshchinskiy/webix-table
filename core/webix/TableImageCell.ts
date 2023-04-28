import './TableImageCell.scss';

export const getTableImageCellTemplate = (url: string, id: string): string => (`
  <div class="table-image-cell">
    <div class="table-image-cell__container">
        <img class="table-image-cell__image table-image-cell__image_scalable" src="${url}" alt="item-photo-${id}" />
        <div class="table-image-cell__popover">
                <img class="table-image-cell__demo" src="${url}" alt="item-photo-${id}" />
        </div>
    </div>
  </div>
`);
