<template lang="jade">
#app.center
  template(v-if="loaded")
    #stage_0(v-if="stage === 0").container
      .row
        .desc.col.s12(v-html = 'markdown(start_desc)')
      .row
        button.col.s12.btn.light-blue.darken-2(@click="start_q") 开始答题
    #stage_1(v-if="stage === 1").container
      .row
        h2.light-blue-text.text-darken-2.col.s12 {{current_question.question}}
      .row
        p.index_counter.blue-grey-text.text-lighten-2.col.s12 ({{question_index+1}} / {{questions.length}})
      .row(v-if="current_question.desc")
        .desc.col.s12(v-html = 'markdown(current_question.desc)')
      .row(v-if="current_question.type === 'input'")
        .input-field.col.s12
          input#answer_input(type="text", v-model="current_question.answer", :placeholder="current_question.tips")
      .row(v-else)
        form.col.s12(action="#")
          template(v-for="(opt, index) in current_question.options")
            p.q_option(@click="current_question.answer = opt")
              input.with-gap.light-blue.darken-2(
                :checked="opt === current_question.answer",
                name="answer_opt", 
                type="radio", 
                :id="'ans_opt_'+index")
              label.black-text.large(:for="'ans_opt_'+index") {{opt}}
      .row
        button.col.s6.btn.grey.lighten-1.black-text(:class="{disabled: !has_priv}", @click="priv_q")
          | 上一题
        button.col.s6.btn.light-blue.darken-2(v-if="!is_last_question", :class="{disabled: !has_next}", @click="next_q")
          | 下一题
        button.col.s6.btn.light-blue.darken-2(v-else, @click="end_q")
          | 完成答题
    #stage_2(v-if="stage === 2").container
      .row
        .desc.col.s12(v-html = 'markdown(code_desc)')
      .row
        .input-field.col.s12
          input#password_input.disabled(type="text", v-model="password")
      .row
          button.col.s6.btn.orange(@click="reset_status") 重新答题
          button#copy_btn.col.s6.btn.light-blue.darken-2(
            data-clipboard-target="#password_input"
          ) 复制到剪贴板
  #loading(v-else)
    h1.title Loading
    .preloader-wrapper.big.active
      .spinner-layer.spinner-blue-only
        .circle-clipper.left
          .circle
</template>

<script>
import axios from 'axios'
import YAML from 'js-yaml'
import sha256 from 'sha256'
import marked from 'marked'
import Clipboard from 'clipboard'

const CODE_LEN = 16

export default {
  data(){
    return {
      stage:    0,
      loaded:   false,
      password: '',
      question_index: 0,
      questions: null,
      salt: null,
      start_desc: '',
      code_desc: ''
    }
  },
  computed: {
    has_next(){
      return this.questions && this.question_index < this.questions.length-1 && this.current_question.answer
    },
    has_priv(){
      return this.questions && this.question_index > 0
    },
    current_question(){
      return this.questions && this.questions[this.question_index]
    },
    is_last_question(){
      return this.question_index === this.questions.length-1
    }
  },
  methods: {
    next_q(){
      if(this.has_next){
        this.question_index ++
      }
    },
    priv_q(){
      if(this.has_priv){
        this.question_index --
      }
    },
    gen_password(){
      let answer = this.questions.map(q => q.answer).join(",")
      let s = `${this.salt}$${answer}`
      let hash = sha256(s)
      return hash
    },
    start_q(){
      this.stage = 1
    },
    end_q(){
      this.password = this.gen_password().slice(0, CODE_LEN)
      this.stage = 2
    },
    toast(txt){
      Materialize.toast(txt, 3000)
    },
    markdown(s){
      return marked(s.split(/\n+/).join("\n\n"))
    },
    reset_status(){
      for(let q of this.questions){
        q.answer = null
      }
      this.question_index = 0
      this.stage = 0
    }
  },
  mounted(){
    let clipboard = new Clipboard('#copy_btn')
    clipboard.on('success', evt => {
      this.toast('Copied!')
    })
    clipboard.on('error', evt => {
      this.toast('Failed.')
    })
  },
  created(){
    let p1 = axios.get('info.yaml')
      .then(res => YAML.load(res.data))
      .then(({title, start_desc, code_desc}) => {
        document.title = title
        this.code_desc = code_desc
        this.start_desc = start_desc
      })
    let p2 = axios.get('salt.yaml')
      .then(res => YAML.load(res.data))
      .then(({salt}) => {
        this.salt = salt
      })
    let p3 = axios.get('answer.yaml')
      .then(res => YAML.load(res.data))
      .then(({answer_hash}) => {
        this.answer_hash = answer_hash
      })
    let p4 = axios.get('questions.yaml')
      .then(res => YAML.load(res.data))
      .then((questions) => {
        this.questions = questions.map(q => {
          q.answer = null
          return q
        })
      })
    Promise.all([p1, p2, p3, p4]).then(() => {
      this.loaded = true
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 1.5rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
}
#tab_edit{
  min-height: 40rem;
}
#editor{
  z-index: 10;
}
h1 {
  color: #0288d1;
}
.desc h1, .desc h2, .desc h3, .desc h3, .desc h4, .desc h5, .desc h6, .desc img{
  text-align: center;
  color: #0288d1;
}
.desc p, .desc div, .desc pre{
  text-align: left;
}
#password_input{
  text-align: center;
  font-size: 2.5rem;
}
.index_counter, h2{
  margin: 0;
}
</style>
