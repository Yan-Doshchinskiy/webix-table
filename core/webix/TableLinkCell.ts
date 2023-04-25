import './TableLinkCell.scss';

type TLinkTarget = '_self' | '_blank'

export const getTableLinkCellTemplate = (text: string, link: string, target: TLinkTarget = '_self'): string => `
  <a class="table-link-cell" href="${link}" target="${target}">
   ${text}
  </a>
`;
