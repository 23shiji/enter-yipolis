export default function(){
  let s = prompt("在此处输入坐标")
  if(!s) return
  let res = s.match(/(\d+\.?\d*)[^\dNS]*([NS]?)[^WESN\d]*(\d+\.?\d*)[^\dWE]*([WE]?)/)
  if(!res){
    alert("不是有效的坐标信息")
    return
  }
  let [_, lat_val, lat_sp, lng_val, lng_sp] = res
  lat_val = parseFloat(lat_val)
  lng_val = parseFloat(lng_val)
  if(lat_sp == "N") lat_val = lat_val
  else if(lat_sp == "S") lat_val = -lat_val
  else lat_val = 0
  if(lng_sp == "E") lng_val = lng_val
  else if(lng_sp == "W") lng_val = -lng_val
  else lng_val = 0
  this.pos_lat = lat_val
  this.pos_lng = lng_val
}