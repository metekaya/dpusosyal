$(document).ready(() => {

    if(selectedTab === "yanitlar"){
        loadReplies();
    }
    else{
        loadPosts();
    }
});

function loadPosts(){
    $(document).ready(() => {
        $.get("/api/posts", {postedBy: profileUserId, isReply: false}, results => {
            outputPosts(results, $(".postsContainer"));
        })
    })
    
    
}

function loadReplies(){
    $(document).ready(() => {
        $.get("/api/posts", {postedBy: profileUserId, isReply: true}, results => {
            outputPosts(results, $(".postsContainer"));
        })
    })
    
    
}