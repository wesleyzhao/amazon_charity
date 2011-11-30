function save_options(){

    var tag_input = document.getElementById('tag-input');
    var new_tag = tag_input.value;
    localStorage["tag"] = new_tag;
    localStorage["last_good_session_id"] = "";
    change_saved_message("Your new tag was saved as: " + new_tag);

}

function restore_options(){

    var tag = localStorage['tag'];
    var last_good_session_id = localStorage['last_good_session_id'];

    if (!tag) tag = "no-tag-saved-yet";
    var tag_input = document.getElementById('tag-input');
    var id_input = document.getElementById('hidden-session-id');
    
    tag_input.value = tag;
    id_input.value = last_good_session_id;
}

function change_saved_message(message){

    var message_box = document.getElementById('saved-message');
    message_box.innerHTML = message;
    setTimeout(function(){
	message_box.innerHTML = "";
    }, 750);

}