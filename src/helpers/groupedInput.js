export default function OptionsGroup(data = [], key = "category" ) {
	const options = data.map(option => {
		const firstLetter = option[key]

		return {
			[key]: firstLetter,
			...option
		}
	})

	return options.sort((a, b) => -b[key].localeCompare(a[key]))
}