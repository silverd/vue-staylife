<template>

  <div class="s_main_comment">
    <ul class="s_main_comment_list">
      <li v-for="comment in comments" track-by="$index">
        <div class="comment_user_icon">
          <img :src="comment.headimgurl | getThumbUrl 40 40" />
        </div>
        <div class="comment_user_info">
          <div class="fl">
            <p>{{comment.nickname}}</p>
            <p><span class="pr10">{{comment.pub_addr}}</span></p>
          </div>
        </div>
        <div class="comment_time">{{comment.created_at | timeFormatForDetail}}</div>
        <div class="comment_text">{{comment.content}}</div>
      </li>
    </ul>
  </div>

</template>

<script>

export default {

  props: [
    'comments'
  ]

}

</script>