/**
 * Created on 08.01.14.
 */
function Discussion(){
    var $this = this;
    $('.text-area-box .text-area').bind("mouseup",function(){
        $this.selectText($this);
    });
}
Discussion.prototype.selectText = function($this){
    $("mark").contents().unwrap();
    $("mark").remove();
    //$this.removeEmptyResponses($this);
    var selection = $this.getSelection();
    var range = selection.getRangeAt(0);
    var cssclass = $(selection.anchorNode.parentNode).attr("class");
    if(selection.toString().length > 0){
        $this.startPoint = selection.anchorOffset;
        $this.endPoint = selection.extentOffset;
        var newNode = document.createElement("mark");
        range.surroundContents(newNode);
        $("mark").attr('title', ' ');
        //console.log($("mark"));
        $("mark").tooltip({
            content : "<div class='quote-action'>Цитировать</div>",
            position: { my: "right", at: "left top" }
        });
        $("mark").on('mouseleave',function(event){
            event.stopImmediatePropagation();
        }).tooltip("open");

        $('.quote-action').position({
            my: "left top-26",
            at: "left top",
            of: "mark"
        });

    }
    $(document).on('mousedown', '.quote-action', function(){
        var seltext = $.selection();
        //console.log(seltext)
        var seltextreplaced = seltext.replace(/\n/g, '\n>');
        $('.request-area.request-answer-area .text-area-box textarea').text('>'+seltextreplaced);
    });
};
Discussion.prototype.getSelection = function(){
    if(window.getSelection){
        return window.getSelection();
    }
    else if(document.getSelection){
        return document.getSelection();
    }
    else if(document.selection){
        return document.selection.createRange().text;
    }
}
var discussion = new Discussion();