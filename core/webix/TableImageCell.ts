import './TableImageCell.scss';

export const getTableImageCellTemplate = <K extends Record<string, any>>(field: keyof K): string => (`
  <div class="table-image-cell">
    <div class="table-image-cell__container">
        <img class="table-image-cell__image" src="#${field}#" alt="image-#productWbId#" />
    </div>
  </div>
`);
