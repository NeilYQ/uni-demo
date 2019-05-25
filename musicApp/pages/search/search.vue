<template>
	<view class="content">
		<!-- 热门搜索 -->
		<view class="search-hots">
			<view class="uni-title">热门搜索</view>
			<view @click="getHot(item.first)" class="tag-view" v-for="(item, index) in hots" :key="index">
				<uni-tag circle="true" :text="item.first"></uni-tag>
			</view>
		</view>
		<!-- 历史记录 -->
		<view class="search-history">
			<view class="uni-title">历史记录</view>
			<view class="tag-view" v-for="(item, index) in searchHistory" :key="index">
				<uni-tag circle="true" :text="item"></uni-tag>
			</view>
		</view>
		<!-- 搜索结果 -->
		<view class="search-results">
			<text class="uni-title">搜索结果</text>
			<view class="uni-list">
				<view @click="getSrc(item)" class="uni-list-cell" v-for="(item, index) in searchList" :key="index">
					<view class="uni-media-list">
						<view class="uni-media-list-body">
							<view class="uni-media-list-body-top uni-ellipsis">{{ item.name }}</view>
							<view class="uni-media-list-body-bottom uni-ellipsis">{{ item.artists[0].name }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 下方播放盒 -->
		<player></player>
	</view>
</template>

<script>
	import uniTag from "@/components/uni-tag/uni-tag.vue";
	import uniList from "@/components/uni-list/uni-list.vue";
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue";
	import player from "@/components/player/player.vue";
	import Vuex from "vuex";
	export default {
		components: {
			uniTag,
			uniList,
			uniListItem,
			player
		},
		data() {
			return {
				hots: [],
				searchHistory: [],
				searchList: []
			};
		},
		mounted(){
			uni.request({
				url: "https://api.wulv5.com/music/search/hot",
				success: (res)=>{
					this.hots = res.data.result.hots;
				}
			});
		},
		methods: {
			...Vuex.mapActions(['getSrc']),
			getHot(searchkey){
				uni.request({
					url: `https://api.wulv5.com/music/search?keywords=${searchkey}`,
					success: (res)=>{
						this.searchList = res.data.result.songs;
					}
				});
			}
		},
		onNavigationBarSearchInputConfirmed(e){
			this.searchHistory.push(e.text);
			this.getHot(e.text);
		}
	}
</script>

<style>
	.tag-view{
		display: inline-block;
		margin: 10upx 20upx;
	}
</style>
