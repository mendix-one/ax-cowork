const locale: IGanttLocale = {
	date: {
		month_full: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"],
		month_short: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sept", "Okt", "Nov", "Dec"],
		day_full: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"],
		day_short: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"]
	},
	labels: {
		new_task: "Nová úloha",
		icon_save: "Uložiť",
		icon_cancel: "Späť",
		icon_details: "Detail",
		icon_edit: "Edituj",
		icon_delete: "Zmazať",
		confirm_closing: "Vaše zmeny nebudú uložené. Skutočne?", // Vaše změny budou ztraceny, opravdu ?
		confirm_deleting: "Udalosť bude natrvalo vymazaná. Skutočne?",
		section_description: "Poznámky",
		section_time: "Doba platnosti",
		section_type: "Type",
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
		message_cancel: "Späť",

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
