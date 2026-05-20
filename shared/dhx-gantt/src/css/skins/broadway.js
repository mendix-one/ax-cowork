export default function (gantt) {
  gantt.skins.broadway = {
    config: {
      grid_width: 390,
      row_height: 35,
      scale_height: 35,
      link_line_width: 1,
      link_arrow_size: 9,
      bar_height_padding: 4,
      lightbox_additional_height: 86,
    },
    _second_column_width: 100,
    _third_column_width: 80,

    _lightbox_template:
      "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span><div class='gantt_cancel_btn'></div></div><div class='gantt_cal_larea'></div>",
    _config_buttons_left: {},
    _config_buttons_right: {
      gantt_delete_btn: 'icon_delete',
      gantt_save_btn: 'icon_save',
    },
  }
}
