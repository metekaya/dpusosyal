$(document).ready(() => {

    if(selectedTab === "followers"){
        loadFollowers();
    }
    else{
        loadFollowing();
    }
});

function loadFollowers(){
    $(document).ready(() => {
        $.get(`/api/users/${profileUserId}/followers`, results => {
            outputUsers(results.followers, $(".resultsContainer"));
        })
    })  
}

function loadFollowing(){
    $(document).ready(() => {
        $.get(`/api/users/${profileUserId}/following`, results => {
            outputUsers(results.following, $(".resultsContainer"));
        })
    })
}

