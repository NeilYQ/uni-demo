<script>
	import Vuex from 'vuex' 
	export default {
		computed: {
			...Vuex.mapState(['audio', 'history', 'musicIndex', 'styleMode'])
		},
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/uni.css";
	body{font-family: "Microsoft YaHei",serif;}
    body,dl,dd,p,h1,h2,h3,h4,h5,h6{margin:0;}
    ol,ul,li{margin:0;padding:0;list-style:none;}
    img{border:none;}
	.uni-title {
		font-weight: bold;
		font-size: 35upx;
		padding-left: 15upx;
	}
</style>
