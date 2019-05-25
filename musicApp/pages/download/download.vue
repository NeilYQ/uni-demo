<template>
	<view>
		<ul>
			<li v-for="(item, index) in list" :key="index">{{ item.filePath }}</li>
		</ul>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		mounted(){
			uni.getSavedFileList({
				success: (res) => {
					console.log(JSON.stringify(res));
					this.list = res.fileList
				}
			})
		}
	}
</script>

<style>

</style>
