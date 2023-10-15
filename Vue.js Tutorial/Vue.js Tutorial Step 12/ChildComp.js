export default {
	props: {
	  msg: String
	},
	template: `
	<h2>{{ msg || 'No props passed yet' }}</h2>
	`
  }