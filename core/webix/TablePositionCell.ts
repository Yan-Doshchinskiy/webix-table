import './TablePositionCell.scss';

export const getTablePositionCellTemplate = (position: number, difference: number): string => {
  const mainClass = 'table-position-cell__change';
  const modifier = difference > 0 ? 'positive' : 'negative';
  const mainClassWithModifier = `${mainClass}_${modifier}`;
  const hasModifier = difference !== 0;
  const finalClass = hasModifier ? `${mainClass} ${mainClassWithModifier}` : mainClass;
  return `
  <div class="table-position-cell">
   <span>${position}</span>
   <span class="${finalClass}">${difference}</span>
  </div>
`;
};
