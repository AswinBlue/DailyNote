export const sidebar_active_threshold = 900;
export const score_field_prefix = "CDATA_";
export const score_field_default = [score_field_prefix + "today's Mood"];
// TODO: 언어팩 KR, ENG 적용
export const list_table_grid = [
    {
      headerText: 'summary',
      field: 'summary',
      textAlign: 'Center',
      width: '120',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
    {
      headerText: 'description',
      field: 'description',
      textAlign: 'Center',
      width: '120',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
    {
      headerText: 'start',
      field: 'start',
      textAlign: 'Center',
      width: '120',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
  ];

  export const dashboard_config = {
    lineChart : {
      height: '120px',
      width: '550px',
    },
    stackedChart: {
      width: '550px',
      height: '360px',
    }
  }