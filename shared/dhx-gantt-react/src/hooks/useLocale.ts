import { useEffect } from 'react';
import { isEqual } from 'lodash-es';

export function useLocale(
	ganttRef: any | null,
	locale: any,
	debounceRender: () => void
) {
	useEffect(() => {
		if (!ganttRef.current) return;
		const gantt = ganttRef.current;

		const applyLocale = () => {
			gantt.i18n.setLocale(locale);
			debounceRender();
		}
		if(typeof locale === "string"){
			if(!isEqual(gantt.locale, gantt.i18n.getLocale(locale))){
				applyLocale();
			}
			return;
		}

		if(locale && !isEqual(gantt.locale, locale)){
			applyLocale();
		}

	}, [locale]);
}