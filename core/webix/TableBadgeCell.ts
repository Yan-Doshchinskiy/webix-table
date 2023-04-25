import './TableBadgeCell.scss';

export const getTableBadgeCellTemplate = (position: number, difference: number): string => {
  const mainClass = 'table-badge-cell__change';
  const modifier = difference > 0 ? 'positive' : 'negative';
  const mainClassWithModifier = `${mainClass}_${modifier}`;
  const hasModifier = difference !== 0;
  const finalClass = hasModifier ? `${mainClass} ${mainClassWithModifier}` : mainClass;
  return `
  <div class="table-badge-cell">
   <span>${position}</span>
   <span class="${finalClass}">${difference}</span>
  </div>
`;
};
