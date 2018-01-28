import YAML from 'js-yaml'
import types_list from '../../types.yaml'
import planets_list from '../../planets.yaml'

export default function(evt){
  if(evt.target.files.length == 0){
    return
  }
  const file = evt.target.files[0]
  const reader = new FileReader()
  reader.onload = (evt) => {
    const result = evt.target.result
    const [meta, markdown] = YAML.safeLoadAll(result)
    const v_md = typeof(markdown) === "string"
    const {
      title,
      authors,
      version,
      type,
      pos,
      planet
      // tags
    } = meta
    const v_authors = Array.isArray(authors)
    // const v_tags = Array.isArray(tags)
    const v_version = typeof(version) === "number" && version >= 0
    const v_type = types_list.some(t => t.type === type)
    const v_pos  = !pos || ( typeof(pos.lng) === "number" && typeof(pos.lat) === "number" )
    const v_planet = planets_list.some(p => p.planet === planet)
    if(
        !v_md || 
        !v_authors || 
        // !v_tags || 
        !v_version 
        || !v_type 
        || !v_pos
        || !v_planet){
      alert("非法文件格式")
      console.error(meta)
      console.error({v_md, v_authors, v_version, v_pos, v_planet})
      return
    }
    this.planet = planet
    this.title =    title
    this.authors =  authors
    this.version =  version + 1
    if(pos){
      this.with_pos = true
      this.pos_lat = pos.lat
      this.pos_lng = pos.lng
    }else{
      this.with_pos = false
    }
    this.loctype =     type
    this.planet  =     planet
    // this.tags =     tags
    this.markdown = markdown
  }
  reader.readAsText(file)
}