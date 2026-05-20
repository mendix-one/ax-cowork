const locale: IGanttLocale = {
	date: {
		month_full: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
		month_short: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
		day_full: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
		day_short: ["Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"]
	},
	labels: {
		new_task: "Нове завдання",
		icon_save: "Зберегти",
		icon_cancel: "Відміна",
		icon_details: "Деталі",
		icon_edit: "Редагувати",
		icon_delete: "Вилучити",
		confirm_closing: "", // Ваші зміни втратяться. Ви впевнені ?
		confirm_deleting: "Подія вилучиться назавжди. Ви впевнені?",
		section_description: "Опис",
		section_time: "Часовий проміжок",
		section_type: "Тип",
		section_deadline: "Deadline",
		section_baselines: "Baselines",
		/* grid columns */

		column_wbs: "WBS",
		column_text: "Task name",
		column_start_date: "Start time",
		column_duration: "Duration",
		column_add: "",

		/* link confirmation */
		link: "Link",
		confirm_link_deleting: "will be deleted",
		link_start: " (start)",
		link_end: " (end)",

		type_task: "Task",
		type_project: "Project",
		type_milestone: "Milestone",


		minutes: "Minutes",
		hours: "Hours",
		days: "Days",
		weeks: "Week",
		months: "Months",
		years: "Years",

		/* message popup */
		message_ok: "OK",
		message_cancel: "Відміна",

		/* constraints */
		section_constraint: "Constraint",
		constraint_type: "Constraint type",
		constraint_date: "Constraint date",
		asap: "As Soon As Possible",
		alap: "As Late As Possible",
		snet: "Start No Earlier Than",
		snlt: "Start No Later Than",
		fnet: "Finish No Earlier Than",
		fnlt: "Finish No Later Than",
		mso: "Must Start On",
		mfo: "Must Finish On",

		/* resource control */
		resources_filter_placeholder: "type to filter",
		resources_filter_label: "hide empty",

		/* empty state screen */
		empty_state_text_link: "Click here",
		empty_state_text_description: "to create your first task",

		/* baselines control */
		baselines_section_placeholder: "Start adding a new baseline",
		baselines_add_button: "Add Baseline",
		baselines_remove_button: "Remove",
		baselines_remove_all_button: "Remove All",

		/* deadline control */
		deadline_enable_button: "Set",
		deadline_disable_button: "Remove"
	}
};

export default locale;
