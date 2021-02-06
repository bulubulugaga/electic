import map from '../static/map/qqmap-wx-jssdk.min.js'; //腾讯地图
export const getLocation = (t1,lon,lat) => {
	return new Promise((resolve,reject) => {
		let t = t1;
		let qqmapsdk = new map({
			key: t.$store.state.mapKey //腾讯地图生成的key
		});
		
		uni.getLocation({ //uniapp获取经纬度
			type: 'gcj02',
			success: function(res) {
				let latitude = res.latitude;
				let longitude = res.longitude;
				
				resolve(1000000);
		
		// 		qqmapsdk.reverseGeocoder({ //腾讯题图逆解析地址
		// 			location: {
		// 				latitude: lat || latitude,
		// 				longitude: lon || longitude
		// 			},
		// 			success(res) {
		// 				let province = res.result.address_component.province;
		// 				let city = res.result.address_component.city;
		// 				let district = res.result.address_component.district;
		// 				let id = 0;
		// 				let pid = 0;
		
		
		// 				t.$listapi.getArea(t.$store.state.sessionId, null).then(res => { //国
		// 					pid = id = res.data.collection[0].id;
		// 					t.$listapi.getArea(t.$store.state.sessionId, id).then(res => { //省
		// 						for (let item of res.data.collection) {
		// 							if (province.indexOf(item.name) !== -1) {
		// 								id = item.id;
		// 								break;
		// 							}
		// 						}
		// 						if (pid !== id) {
		// 							t.$listapi.getArea(t.$store.state.sessionId, id).then(res => { //市
		// 								for (let item of res.data.collection) {
		// 									if (city.indexOf(item.name) !== -1) {
		// 										pid = id
		// 										id = item.id;
		// 										break;
		// 									}
		// 								}
		// 								if (pid !== id) {
		// 									t.$listapi.getArea(t.$store.state.sessionId, id).then(res => { //区或县
		// 										for (let item of res.data.collection) {
		// 											if (district.indexOf(item.name) !== -1) {
		// 												pid = id
		// 												id = item.id;
		// 												break;
		// 											}
		// 										}
		// 										if(!lat) {
		// 											t.$store.commit('setAd', id);
		// 										}
		// 										resolve(id);
		// 									})
		// 								} else {
		// 									if(!lat) {
		// 										t.$store.commit('setAd', id);
		// 									}
		// 									resolve(id);
		// 								}
		// 							})
		// 						} else {
		// 							if(!lat) {
		// 								t.$store.commit('setAd', id);
		// 							}
		// 							resolve(id);
		// 						}
		
		// 					})
		// 				})
		// 			},
		// 			fail(err) {
		// 				console.log(err);
		// 			}
		// 		})
		
			},
			fail(err) {
				console.log(err);
			}
		});
	})
 	
 }
