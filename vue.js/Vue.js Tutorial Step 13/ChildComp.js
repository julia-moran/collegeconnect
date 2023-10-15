export default {
	emits: ['response'],
	created() {
	  this.$emit('response', 'hello from child')
	},
	template: `
	<h2>Child component</h2>
	`
  }