<template>
	<view @click="toMusicPage()" class="player-body">
		<view class="content" v-if="details.name">
			<view class="music-pic">
				<image :src="details.picUrl" alt="" lazy-load="true"></image>
			</view>
			<view class="music-msg">
				<view class="music-name">{{ details.name }}</view>
				<view class="music-author">{{ details.author }}</view>
			</view>
			<view class="control">
				<view><image @click.stop="paused?play():pause()" class="control-play" :src="'../../static/'+ (paused ? 'paused' : 'play') +'.png'"></image></view>
				<view><image @click.stop="showMenu()" class="control-menu" src="../../static/menu.png"></image></view>
			</view>
			<view class="menu">
				<view @click.stop="hideMenu()" :class=" 'mask ' + (ifshow?'show':'')"></view>
				<view :class=" 'menulist ' + (ifshow?'show':'')">
					<view class="msg"></view>
					<ul>
						<li v-for='(item, index) in history' :key='index'>
							<span class="name">{{ item.detail.name }}</span> - <span class="author">{{ item.detail.author }}</span>
						</li>
					</ul>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Vuex from "vuex";
	export default {
		computed: {
			...Vuex.mapState(['details', "paused", 'history'])
		},
		data(){
			return {
				ifshow: false
			}
		},
		mounted(){
// 			var mask = this.$children[0].$children[0].$el.children[3].children[0],
// 				list = this.$children[0].$children[0].$el.children[3].children[1]
// 			;
// 			mask.addEventListener('touchmove', (e)=>{
// 				e.preventDefault();
// 				console.log(1);
// 			});
// 			list.addEventListener('touchmove', (e)=>{
// 				
// 			});
			console.log(this);
		},
		methods:{
			...Vuex.mapMutations(["play", "pause", "pre", "next"]),
			toMusicPage(){
				uni.navigateTo({
					url: "../../pages/music/music"
				});
			},
			showMenu(){
				this.ifshow = true;
			},
			hideMenu(){
				// e.preventDefault()
				this.ifshow = false;
			}
		}
	}
</script>

<style>
	.player-body{
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: rgba(255,255,255,.98);
		box-shadow:0 0 1px 2px #fff;
		z-index: 100;
	}	
	.player-body .content{
		display:flex;
	}
	.player-body .content>view{	
		flex-direction:column;
		flex-wrap:nowrap;
		justify-content:space-between;
		align-items:center;
	}
	.music-pic{
		flex-shrink:0;
		width:40px;
		height:40px;
		margin:6px;
		border-radius: 50%;
		overflow:hidden;
	}
	.music-pic>image{
		width:40px;
		height:40px;
	}
	.music-msg{	
		flex-grow:2;
		padding:0 10px;
		overflow:hidden;
	}
	.music-msg>view{
		width:100%;
		height:18px;
		white-space:nowrap;
		text-overflow:ellipsis;
		overflow:hidden;
	}
	.music-msg .music-name{
		font-size:14px;
	}
	.music-msg .music-author{
		color:#bbb;
		font-size:12px;
	}
	.control{
		flex-shrink:0;
		padding:0 10px;
	}	
	.control>view{
		display:inline-block;
		line-height: 56px;
	}
	.control image{
		width:20px;
		height:20px;
	}
	.menu .mask{
		display:none;
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0,0,0,.3);
		z-index:20;
	}
	.menu .menulist{
		position:fixed;
		left:0;
		bottom:0;
		width:100%;
		height:200px;
		padding-top:20px;
		background:linear-gradient(to bottom, #fff, #fefefe);
		border-top-right-radius: 5px;
		border-top-left-radius: 5px;
		transform: translateY(200px);
		transition:.3s;
		overflow-y: scroll;
		z-index:100;
	}	
	.menu .mask.show{
		display:block;
	}
	.menu .menulist.show{
		transform: translateY(0);
	}
	.menu .menulist li{
		margin:0 10px;
		padding:0 6px;
		border-bottom:1px solid #CCC;
		line-height: 32px;
	}
	.menu .menulist li .name{
		padding:0 6px;
		color:#000;
		font-size:14px;
	}
	.menu .menulist li .author{
		padding:0 6px;
		color:#c0c0c0;
		font-size:12px;
	}
</style>
