const locale: IGanttLocale = {
	date: {
		month_full: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"],
		month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		day_full: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"],
		day_short: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"]
	},
	labels: {
		new_task: "Nova naloga",
		icon_save: "Shrani",
		icon_cancel: "Prekliči",
		icon_details: "Podrobnosti",
		icon_edit: "Uredi",
		icon_delete: "Izbriši",
		confirm_closing: "", // Spremembe ne bodo shranjene. Želite nadaljevati ?
		confirm_deleting: "Dogodek bo izbrisan. Želite nadaljevati?",
		section_description: "Opis",
		section_time: "Časovni okvir",
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
		message_cancel: "Prekliči",

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
