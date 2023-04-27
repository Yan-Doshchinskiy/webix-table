import './TableFavoritesCell.scss';

export const getTableFavoriteCellTemplate = (isFavorite: boolean, clickSelector: string): string => {
  const iconClass = isFavorite ? 'table-favorites-cell__icon table-favorites-cell__icon_active' : 'table-favorites-cell__icon';
  return `
    <div class="table-favorites-cell">
      <svg
        class="${iconClass} ${clickSelector}"
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
       >
        <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
        </path>
      </svg>
    </div>
  `;
};
