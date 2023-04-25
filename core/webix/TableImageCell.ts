import './TableImageCell.scss';

export const getTableImageCellTemplate = (url: string, id: string): string => (`
  <div class="table-image-cell">
    <div class="table-image-cell__container">
        <img class="table-image-cell__image" src="${url}" alt="item-photo-${id}" />
    </div>
  </div>
`);
