const locale: IGanttLocale = {
  date: {
    month_full: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
    month_short: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    day_full: ['Vasárnap', 'Hétfõ', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'szombat'],
    day_short: ['Va', 'Hé', 'Ke', 'Sze', 'Csü', 'Pé', 'Szo'],
  },
  labels: {
    new_task: 'Új feladat',
    icon_save: 'Mentés',
    icon_cancel: 'Mégse',
    icon_details: 'Részletek',
    icon_edit: 'Szerkesztés',
    icon_delete: 'Törlés',
    confirm_closing: '', // A változások elvesznek, biztosan folytatja? "
    confirm_deleting: 'Az esemény törölve lesz, biztosan folytatja?',
    section_description: 'Leírás',
    section_time: 'Idõszak',
    section_type: 'Type',
    section_deadline: 'Deadline',
    section_baselines: 'Baselines',
    /* grid columns */

    column_wbs: 'WBS',
    column_text: 'Task name',
    column_start_date: 'Start time',
    column_duration: 'Duration',
    column_add: '',

    /* link confirmation */
    link: 'Link',
    confirm_link_deleting: 'will be deleted',
    link_start: ' (start)',
    link_end: ' (end)',

    type_task: 'Task',
    type_project: 'Project',
    type_milestone: 'Milestone',

    minutes: 'Minutes',
    hours: 'Hours',
    days: 'Days',
    weeks: 'Week',
    months: 'Months',
    years: 'Years',

    /* message popup */
    message_ok: 'OK',
    message_cancel: 'Mégse',

    /* constraints */
    section_constraint: 'Constraint',
    constraint_type: 'Constraint type',
    constraint_date: 'Constraint date',
    asap: 'As Soon As Possible',
    alap: 'As Late As Possible',
    snet: 'Start No Earlier Than',
    snlt: 'Start No Later Than',
    fnet: 'Finish No Earlier Than',
    fnlt: 'Finish No Later Than',
    mso: 'Must Start On',
    mfo: 'Must Finish On',

    /* resource control */
    resources_filter_placeholder: 'type to filter',
    resources_filter_label: 'hide empty',

    /* empty state screen */
    empty_state_text_link: 'Click here',
    empty_state_text_description: 'to create your first task',

    /* baselines control */
    baselines_section_placeholder: 'Start adding a new baseline',
    baselines_add_button: 'Add Baseline',
    baselines_remove_button: 'Remove',
    baselines_remove_all_button: 'Remove All',

    /* deadline control */
    deadline_enable_button: 'Set',
    deadline_disable_button: 'Remove',
  },
}

export default locale
