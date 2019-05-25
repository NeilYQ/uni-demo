<template>
	<view>
		<view class="uni-list">
			<view @click="playMusic(item)" class="uni-list-cell" v-for="(item, index) in history" :key="index">
				<view class="uni-media-list">
					<view class="uni-media-list-body">
						<text class="uni-media-list-body-top uni-ellipsis">{{ item.detail.name }}</text>
						<text class="uni-media-list-body-bottom uni-ellipsis">{{ item.detail.author }}</text>
					</view>
				</view>
			</view>
		</view>
		<player></player>
	</view>
</template>

<script>
	import player from '../../components/player/player.vue'
	import Vuex from 'vuex'
	export default {
		components:{
			player
		},
		computed:{
			...Vuex.mapState(['history'])
		},
		data() {
			return {
				
			}
		},
		methods: {
			...Vuex.mapMutations(['setSrc', 'setDetail', 'setLrc']),
			playMusic(item){
				// console.log(item);
				this.setDetail(item.detail);
				this.setLrc(item.lrc);
				this.setSrc(item.mp3Url);
			}
		}
	}
</script>

<style>

</style>
