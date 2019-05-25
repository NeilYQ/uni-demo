<template>
	<view class="content">
		<!-- banner图 -->
		<swiper indicator-dots="true" autoplay="true" circular="true" interval="3000">
			<swiper-item class="swiper-item"  v-for="(item, index) in banners" :key="index">
				<view>
					<image :src="item.imageUrl" alt="" lazy-load="true"></image>
				</view>
			</swiper-item>
		</swiper>	
		<!-- 推荐歌单 -->
		<view class="uni-product-list">
			<view @click="playlist(item)" class="uni-product" v-for="(item, index) in playlists" :key="index">
				<view class="image">
					<image class="uni-product-image" :src="item.picUrl" alt="" lazy-load="true"></image>
				</view>
				<view class="uni-product-title">{{item.name}}</view>
			</view>
		</view>
		<!-- 左侧菜单栏 -->
		<uni-drawer @close="drawerClose" :visible="drawerVisible" mode="left">
			<uni-list>
				<uni-list-item @click="toHistoryPage" title="历史记录" note="" show-arrow="false"></uni-list-item>
				<uni-list-item @click="toDownloadPage" title="下载管理" note="" show-arrow="false"></uni-list-item>
			</uni-list>
		</uni-drawer>
		<!-- 下方播放盒 -->
		<player></player>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue";
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue";
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue";
	import player from "@/components/player/player.vue";
	export default {
		components: {
			uniList,
			uniListItem,
			uniDrawer,
			player
		},
		data() {
			return {
				title: 'Hello',
				banners: [],
				playlists: [],
				drawerVisible: false
			}
		},
		onLoad() {
			uni.request({
				url: "https://api.wulv5.com/music/banner",
				success: (res)=>{
					this.banners = res.data.banners;
				}
			});
			uni.request({
				url: "https://api.wulv5.com/music/personalized",
				success: (res)=>{
					this.playlists = res.data.result;
				}
			});
		},
		methods: {
			0(){
				this.drawerVisible = true;
			},
			1(){
				uni.navigateTo({
					url: "../search/search"
				});
			},
			drawerClose(){
				this.drawerVisible = false;
			},
			toHistoryPage(){
				uni.navigateTo({
					url: "../history/history"
				});
			},
			toDownloadPage(){
				uni.navigateTo({
					url: "../download/download"
				});
			},
			playlist(item) {
				// console.log(item)
				uni.navigateTo({
					url: `/pages/playerdetail/playerdetail?id=${item.id}`
				});		
			}
			
		},
		onNavigationBarButtonTap(e){
			this[e.index]();
		}
	}
</script>

<style>
	.swiper-item image{
		width:100%;
	}
</style>
