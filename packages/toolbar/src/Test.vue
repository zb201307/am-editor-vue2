<template>
    <div className="loading" :tip="text" :spinning="loading">
		<slot></slot>
	</div>
</template>

<script lang="ts">

export default ({
    name:"am-loading",
    props:{
        text: String,
        loading: Boolean
    },
})
</script>
<style>
.loading {
	padding: 20px;
	display: block;
}
</style>