import './TableLoader.scss';

export const getTableLoaderTemplate = (): string => {
  console.log('loader');
  return `
    <div class="table-loader">
      <div class="lds-dual-ring" />
    </div>
`;
};
