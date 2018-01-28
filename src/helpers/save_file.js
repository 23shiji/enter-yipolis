import YAML from 'js-yaml'
import FileSaver from 'file-saver'

export default function(){
  let type = this.loctype
  if(!this.username){
    alert("您还没填写名字")
    return
  }
  if(!this.title){
    alert("您还没填写地点名")
    return
  }
  if(type === 'unknown'){
    alert("不可以生成未知类型的地点")
    return
  }
  if(!this.markdown){
    alert("不可以生成空文件")
    return
  }
  let authors = []
  for(let a of this.authors){
    if(a != this.username){
      authors.push(a)
    }
  }
  authors.push(this.username)
  const meta = {
    title: this.title,
    authors,
    type,
    version:  this.version,
    planet:   this.planet,
    pos: this.with_pos ? {lat: parseFloat(this.pos_lat), lng: parseFloat(this.pos_lng)} : null
  }
  const date = new Date
  const text = this.preproc(this.markdown)
  const content = "---\n" + YAML.safeDump(meta) + "---\n" + YAML.safeDump(text)
  const filename = `${this.username}_${this.title}_${this.planet}_v${this.version}.ymd`
  const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, filename);
}